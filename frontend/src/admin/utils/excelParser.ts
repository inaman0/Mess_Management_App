import * as XLSX from 'xlsx';

export interface Dish {
  dishName: string;
  dishType: 'Veg' | 'Non-Veg' | 'Egg';
}

export interface MealPlan {
  Date: Date;
  day: string;
  breakfast: Dish[];
  lunch: Dish[];
  snacks: Dish[];
  dinner: Dish[];
}

// export const excelDateToMongoDate = (serial: number): Date => {
//   const utcDays = serial - 25569;
//   const utcMilliseconds = utcDays * 86400 * 1000;
//   const date = new Date(utcMilliseconds);
//   if (date.getFullYear() < 2000) {
//     const corrected = new Date(date);
//     corrected.setFullYear(2000 + (date.getFullYear() % 100));
//     return corrected;
//   }
//   return date;
// };

export const excelDateToMongoDate = (serial: number): Date => {
  // Excel dates are based on December 30, 1899 (Windows)
  const utcDays = Math.floor(serial - 25569); // 25569 = days between 1900-01-01 and 1970-01-01
  const utcMilliseconds = utcDays * 86400 * 1000;
  
  // Create date in UTC
  const date = new Date(utcMilliseconds);
  
  // Adjust for Excel's leap year bug (1900 was not a leap year)
  if (serial >= 60) {
    date.setUTCDate(date.getUTCDate() - 1);
  }
  
  // Handle year 2000 issue if needed
  if (date.getUTCFullYear() < 2000) {
    date.setUTCFullYear(2000 + (date.getUTCFullYear() % 100));
  }
  
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istTime = date.getTime() + istOffset;
  
  // Return a new Date at midnight in IST
  const istDate = new Date(istTime);
  return new Date(
    istDate.getUTCFullYear(),
    istDate.getUTCMonth(),
    istDate.getUTCDate()
  );
};

const base64EncodeUnicode = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

export const transformMenuData = (data: { [key: string]: (number | string)[] }): MealPlan[] => {
  const result: MealPlan[] = [];
  for (const day in data) {
    const items = data[day];
    const dates: number[] = [];
    let i = 0;
    while (typeof items[i] === 'number') {
      dates.push(items[i] as number);
      i++;
    }

    const mealSections = {
      BREAKFAST: [],
      LUNCH: [],
      SNACKS: [],
      DINNER: [],
    } as Record<string, Dish[]>;

    let currentMeal = '';
    for (; i < items.length; i++) {
      const entry = items[i] as string;
      if (entry === '') continue;
      if (mealSections.hasOwnProperty(entry)) {
        currentMeal = entry;
        continue;
      }
      if (currentMeal && typeof entry === 'string') {
        const trimmed = entry.trim();
        if (trimmed === '') continue;
        const dishType =
          entry.toLowerCase().includes('chicken') ? 'Non-Veg' :
          entry.toLowerCase().includes('egg') ? 'Egg' : 'Veg';
        mealSections[currentMeal].push({ dishName: entry, dishType });
      }
    }

    for (const date of dates) {
      result.push({
        Date: excelDateToMongoDate(date),
        day,
        breakfast: mealSections.BREAKFAST,
        lunch: mealSections.LUNCH,
        snacks: mealSections.SNACKS,
        dinner: mealSections.DINNER,
      });
    }
  }
  return result;
};

export const handleFileUpload = (file: File): Promise<MealPlan[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result) {
        try {
          const data = new Uint8Array(result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          const filteredData = parsedData.filter(row => Array.isArray(row) && row.some(cell => cell != null && cell !== ''));
          const [headers, ...rows] = filteredData;
          const transformedJson: { [key: string]: any[] } = {};
          headers.forEach((header: string, index: number) => {
            transformedJson[header] = rows.map(row => row[index]);
          });
          const mealPlanData = transformMenuData(transformedJson);
          resolve(mealPlanData);
        } catch (error) {
          reject(error);
        }
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};


export const submitMealPlansToMongo = async (
  mealPlans: MealPlan[],
  uploadUrlMeal: string,
  uploadUrlMenuItem: string,
  readMealUrl: string,
  session_id: string
): Promise<'success' | 'partial' | 'error'> => {
  if (!mealPlans || mealPlans.length === 0) return 'error';

  const mealTypes = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
  let totalDishes = 0;
  let successfulDishes = 0;

  // Step 1: Add all Meals
  for (const row of mealPlans) {
    // const dateStr = row.Date.toISOString().split('T')[0];
    
    const istDate = new Date(row.Date.getTime() + (5.5 * 60 * 60 * 1000)); // Add IST offset
    const dateStr = istDate.toISOString().split('T')[0];
    
    for (const mealType of mealTypes) {
      const mealPayload = {
        Date: dateStr,
        Meal_type: mealType,
        IsFeast: ""
      };

      const formData = new URLSearchParams();
      formData.append('resource', base64EncodeUnicode(JSON.stringify(mealPayload)));
      formData.append('resource_name', 'Meal');
      formData.append('action', 'add');
      formData.append('session_id', session_id);

      const mealResponse = await fetch(uploadUrlMeal, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      if (!mealResponse.ok) {
        console.error(`Failed to POST meal for ${mealType} on ${dateStr}`);
      }
    }
  }

  // Step 2: Fetch all meals once to build mealIdMap
  const mealIdMap = new Map<string, string>();
  const readForm = new URLSearchParams();
  readForm.append('queryId', 'GET_ALL');
  readForm.append('session_id', session_id);

  const readResponse = await fetch(readMealUrl + readForm.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  if (!readResponse.ok) {
    console.error('Failed to fetch all meals after insert');
    return 'error';
  }

  const readData = await readResponse.json();
  const meals = readData.resource;

  for (const meal of meals) {
    const mealDate = new Date(meal.Date).toISOString().split('T')[0];
    const mealType = meal.Meal_type;
    const mealId = meal._id || meal.id || meal.resource_id;

    if (mealDate && mealType && mealId) {
      const key = `${mealDate}|${mealType}`;
      mealIdMap.set(key, mealId);
    }
  }

  // Step 3: Add all Dishes (Menu_item)
  for (const row of mealPlans) {
    // const dateStr = row.Date.toISOString().split('T')[0];

    const istDate = new Date(row.Date.getTime() + (5.5 * 60 * 60 * 1000)); // Add IST offset
    const dateStr = istDate.toISOString().split('T')[0];

    for (const mealType of mealTypes) {
      const key = `${dateStr}|${mealType}`;
      const mealId = mealIdMap.get(key);

      if (!mealId) {
        console.error(`Missing meal ID for ${mealType} on ${dateStr}, skipping dish addition`);
        continue;
      }

      const dishes = row[mealType.toLowerCase() as keyof MealPlan] as Dish[];

      if (!dishes || !Array.isArray(dishes)) {
        console.warn(`No dishes found for ${mealType} on ${dateStr}`);
        continue;
      }

      for (const dish of dishes) {
        totalDishes++;

        const menuItemPayload = {
          Dish_name: dish.dishName,
          type: dish.dishType,
          Meal_id: mealId
        };

        const dishFormData = new URLSearchParams();
        dishFormData.append('resource', base64EncodeUnicode(JSON.stringify(menuItemPayload)));
        dishFormData.append('resource_name', 'Menu_item');
        dishFormData.append('action', 'add');
        dishFormData.append('session_id', session_id);

        const dishResponse = await fetch(uploadUrlMenuItem, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: dishFormData.toString()
        });

        if (dishResponse.ok) {
          successfulDishes++;
        } else {
          const errorText = await dishResponse.text();
          console.error(`Failed to POST dish "${dish.dishName}" for ${mealType} on ${dateStr}:`, errorText);
        }
      }
    }
  }

  // Step 4: Final status return
  if (successfulDishes === totalDishes && totalDishes > 0) return 'success';
  if (successfulDishes > 0) return 'partial';
  return 'error';
};
