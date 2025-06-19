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

export const excelDateToMongoDate = (serial: number): Date => {
  const utcDays = serial - 25569;
  const utcMilliseconds = utcDays * 86400 * 1000;
  const date = new Date(utcMilliseconds);
  if (date.getFullYear() < 2000) {
    const corrected = new Date(date);
    corrected.setFullYear(2000 + (date.getFullYear() % 100));
    return corrected;
  }
  return date;
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
  let totalMeals = 0;
  let successfulMeals = 0;

  for (const row of mealPlans) {
    const dateStr = row.Date.toISOString().split('T')[0];

    for (const mealType of mealTypes) {
      totalMeals++;

      // 1. POST Meal
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
        continue;
      }

      // 2. GET meals to fetch _id (using ReadMeal API with query params)
      const readForm = new URLSearchParams();
      readForm.append('queryId', 'GET_ALL');
      // readForm.append('resource', 'Meal');
      readForm.append('session_id', session_id);

      const readResponse = await fetch(readMealUrl+readForm.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        
      });
      

      if (!readResponse.ok) {
        console.error('Failed to read meals');
        continue;
      }

     

      // 3. Find the meal ID by date and type
      // const foundMeal = meals.find(
      //   (meal: any) => meal.Date === dateStr && meal.Meal_type === mealType
      // );

      // if (!foundMeal) {
      //   console.error(`Meal not found for ${mealType} on ${dateStr}`);
      //   continue;
      // }

      // const mealId = foundMeal._id || foundMeal.resource_id;
      // if (!mealId) {
      //   console.error('Meal ID missing');
      //   continue;
      // }

      const readData = await readResponse.json();
      const meals = readData.resource;

if (!Array.isArray(meals)) {
  console.error('Meals data is not an array');
  continue;
}

const filteredMeals = meals.filter((meal: any) => {
  const mealDate = new Date(meal.Date).toISOString().slice(0, 10);
  return mealDate === dateStr && meal.Meal_type === mealType;
});

if (filteredMeals.length === 0) {
  console.error(`Meal not found for ${mealType} on ${dateStr}`);
  continue;
}

const mealId = filteredMeals[0]._id || filteredMeals[0].id || filteredMeals[0].resource_id;

      // 4. POST each dish in that meal
      const dishes = row[mealType.toLowerCase() as keyof MealPlan] as Dish[];
      console.log(dishes);

      for (const dish of dishes) {
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
          successfulMeals++;
        } else {
          console.error(`Failed to add dish ${dish.dishName}`, await dishResponse.text());
        }
      }
    }
  }

  if (successfulMeals === totalMeals) return 'success';
  if (successfulMeals > 0) return 'partial';
  return 'error';
};