import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  const { data: cabins, error } = await supabase.from('cabins').select('*');

  if (error) {
    throw new Error('Cabins could not be loaded');
  }
  return cabins;
}

export async function deleteCabin(id: number) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    throw new Error('Cabin could not be deleted');
  }
  return data;
}

type FormValues = {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: File | string;
};

export async function createCabin(newCabin: FormValues) {
  let imageName;
  if (newCabin.image instanceof File) {
    // If the image is a File, generate the image name
    imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll('/', '');
  } else {
    throw new Error('Image must be a File');
  }
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  const { data, error } = await supabase
    .from('cabins')
    .insert([{ ...newCabin, image: imagePath }])
    .select();
  if (error) {
    throw new Error('Cabin could not be created');
  }
  // Upload the image only if it's a File
  if (newCabin.image instanceof File) {
    const { error: uploadError } = await supabase.storage.from('cabin-images').upload(imageName, newCabin.image);

    if (uploadError) {
      deleteCabin(data[0].id);
      throw new Error('Cabin image could not be uploaded and the cabin was not created');
    }
  }
  return data;
}

type EditCabin = {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: File | string;
};
export async function updateCabin(updates: EditCabin, id: number) {
  let imagePath: string | undefined; // Default to the image in updates, if it's provided

  // Check if the image is a File (new image) or a string (existing image URL)
  if (updates.image instanceof File) {
    // If it's a File, generate a new image name and path, then upload
    const imageName = `${Math.random()}-${updates.image.name}`.replaceAll('/', '');
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    // Upload the new image to Supabase storage
    const { error: uploadError } = await supabase.storage.from('cabin-images').upload(imageName, updates.image);

    if (uploadError) {
      throw new Error('Cabin image could not be uploaded');
    }
  } else if (typeof updates.image === 'string') {
    // If it's a string (URL), we just use the existing URL and don't upload
    imagePath = updates.image;
  }

  // Make sure we are not updating with an undefined image path
  if (imagePath === undefined) {
    throw new Error('Image path must be provided or uploaded');
  }

  // Update the cabin with the new image path (or the existing one) and other updates
  const { data, error } = await supabase
    .from('cabins')
    .update({ ...updates, image: imagePath })
    .eq('id', id)
    .select();

  if (error) {
    throw new Error('Cabin could not be updated');
  }

  return data;
}
