import dbConnect from '@/lib/db';
import Contest from '@/models/Contest';

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Eliminăm caractere speciale
    .replace(/[\s_-]+/g, '-') // Înlocuim spații și underscore cu liniuțe
    .replace(/^-+|-+$/g, ''); // Eliminăm liniuțele de la început și sfârșit
}

export async function createUniqueSlug(nume: string, excludeId?: string): Promise<string> {
  await dbConnect();
  
  const baseSlug = generateSlug(nume);
  let finalSlug = baseSlug;
  let counter = 1;
  
  // Verificăm dacă slug-ul există deja în baza de date
  while (true) {
    const query: any = { slug: finalSlug };
    
    // Excludem concursul curent dacă edităm (pentru a nu se conflicte cu el însuși)
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existingContest = await Contest.findOne(query);
    
    if (!existingContest) {
      // Slug-ul este unic, îl putem folosi
      break;
    }
    
    // Slug-ul există, încercăm cu numărul următor
    counter++;
    finalSlug = `${baseSlug}-${counter}`;
  }
  
  return finalSlug;
}