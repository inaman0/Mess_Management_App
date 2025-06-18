

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
  session_id: string
): Promise<'success' | 'partial' | 'error'> => {
  if (!mealPlans || mealPlans.length === 0) return 'error';

  const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'];
  let totalMeals = 0;
  let successfulMeals = 0;

  try {
    for (const row of mealPlans) {
      const dateStr = row.Date.toISOString().split('T')[0];

      for (const mealType of mealTypes) {
        totalMeals++;

        const payload = {
          Date: dateStr,
          Meal_type: mealType.charAt(0).toUpperCase() + mealType.slice(1), // Capitalize for consistency
          IsFeast: ""
        };

        const formData = new URLSearchParams();
        formData.append('resource', base64EncodeUnicode(JSON.stringify(payload)));
        formData.append('resource_name', 'Meal');
        formData.append('action', 'add');
        formData.append('session_id', session_id);

        const response = await fetch(uploadUrlMeal, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });

        if (response.ok) {
          successfulMeals++;
        } else {
          console.error(`Failed to upload ${payload.Meal_type} for ${dateStr}`, await response.text());
        }
      }
    }

    return successfulMeals === totalMeals ? 'success' : 'partial';
  } catch (error) {
    console.error('Upload error:', error);
    return 'error';
  }
};

