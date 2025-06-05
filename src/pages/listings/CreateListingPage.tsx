import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react';
import { useListings, type ListingFormData } from '../../hooks/useListings';
import Button from '../../components/ui/Button';
import { fileToDataUrl } from '../../lib/utils';

const listingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be a positive number'),
  category: z.string().min(1, 'Please select a category'),
  condition: z.enum(['New', 'Like New', 'Good', 'Fair', 'Poor']),
  location: z.string().min(1, 'Please select a location'),
});

type FormData = z.infer<typeof listingSchema>;

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { createListing, isLoading } = useListings();
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      category: '',
      condition: 'New',
      location: '',
    },
  });
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setImageError(null);
    
    if (images.length + files.length > 5) {
      setImageError('Maximum 5 images allowed');
      return;
    }
    
    const newImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed');
        continue;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size should be less than 5MB');
        continue;
      }
      
      try {
        const dataUrl = await fileToDataUrl(file);
        newImages.push(dataUrl);
      } catch (error) {
        setImageError('Failed to process image');
      }
    }
    
    setImages([...images, ...newImages]);
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const onSubmit = async (data: FormData) => {
    if (images.length === 0) {
      setImageError('At least one image is required');
      return;
    }
    
    try {
      const listingData: ListingFormData = {
        ...data,
        images,
      };
      
      const newListing = await createListing(listingData);
      navigate(`/listings/${newListing.id}`);
    } catch (error) {
      // Error is handled by the useListings hook
    }
  };
  
  const categories = [
    'Textbooks',
    'Electronics',
    'Furniture',
    'Clothing',
    'Appliances',
    'Services',
    'Other',
  ];
  
  const locations = [
    'North Campus',
    'South Campus',
    'West Dorms',
    'East Dorms',
    'Off Campus',
  ];
  
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-8 text-4xl font-extrabold text-gray-900 text-center">Create a New Listing</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-lg">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-lg font-semibold text-gray-800 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              className={`mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-lg p-3 ${errors.title ? 'border-red-500' : ''}`}
              {...register('title')}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-lg font-semibold text-gray-800 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              className={`mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-lg p-3 ${errors.description ? 'border-red-500' : ''}`}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-lg font-semibold text-gray-800 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              className={`mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-lg p-3 ${errors.price ? 'border-red-500' : ''}`}
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-lg font-semibold text-gray-800 mb-2">
              Category
            </label>
            <select
              id="category"
              className={`mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-lg p-3 ${errors.category ? 'border-red-500' : ''}`}
              {...register('category')}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
          {/* Condition */}
          <div>
            <label htmlFor="condition" className="block text-lg font-semibold text-gray-800 mb-2">
              Condition
            </label>
            <select
              id="condition"
              className={`mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-lg p-3 ${errors.condition ? 'border-red-500' : ''}`}
              {...register('condition')}
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
            {errors.condition && (
              <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
            )}
          </div>
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-lg font-semibold text-gray-800 mb-2">
              Location
            </label>
            <select
              id="location"
              className={`mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-lg p-3 ${errors.location ? 'border-red-500' : ''}`}
              {...register('location')}
            >
              <option value="">Select a location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>
          {/* Image Upload */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Images (Max 5)
            </label>
            <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 pt-8 pb-8 bg-gray-50">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-16 w-16 text-gray-400" />
                <div className="flex text-lg text-gray-600 justify-center">
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 px-2"
                  >
                    <span>Upload images</span>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <span className="pl-2">or drag and drop</span>
                </div>
                <p className="text-md text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
            {imageError && (
              <p className="mt-2 text-md text-red-600 text-center">{imageError}</p>
            )}
            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-full rounded-lg object-cover border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-3 -right-3 rounded-full bg-red-500 p-2 text-white hover:bg-red-600 shadow-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full max-w-xs text-xl py-4 rounded-xl shadow-lg"
            >
              Create Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;