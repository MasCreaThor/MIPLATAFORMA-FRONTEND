// src/components/categories/CategoryForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon, XIcon } from 'lucide-react';
import { Category } from '@/services/categoryService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { useRootCategories, useCreateCategory, useUpdateCategory } from '@/hooks/useCategoryOperations';

// Esquema de validación para el formulario
const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  parentId: z.string().optional().or(z.literal('')),
  color: z.string().optional(),
  icon: z.string().optional(),
  isPublic: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: Partial<Category>;
  isEdit?: boolean;
}

export function CategoryForm({ initialData, isEdit = false }: CategoryFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  // Hooks para crear/actualizar categorías
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory(initialData?.id || '');
  
  // Hook para obtener categorías para el selector de padres
  const { data: parentCategories, isLoading: parentCategoriesLoading } = useRootCategories();

  // Inicializar formulario con datos existentes o valores por defecto
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      parentId: initialData?.parentId || '',
      color: initialData?.color || '#3B82F6', // Azul por defecto
      icon: initialData?.icon || '',
      isPublic: initialData?.isPublic || false,
    },
  });

  // Actualiza el color en tiempo real
  const selectedColor = watch('color');

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    try {
      setError(null);

      // Convertir parentId vacío a undefined
      const formData = { 
        ...data, 
        parentId: data.parentId && data.parentId !== '' ? data.parentId : undefined 
      };

      if (isEdit && initialData?.id) {
        await updateCategory(formData);
      } else {
        await createCategory(formData);
      }

      router.push('/dashboard/categories');
    } catch (err: any) {
      console.error('Error submitting category:', err);
      setError(err.response?.data?.message || 'Error al guardar la categoría');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre *
          </label>
          <Input
            id="name"
            {...register('name')}
            error={errors.name?.message}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <Textarea
            id="description"
            rows={3}
            {...register('description')}
            error={errors.description?.message}
          />
        </div>

        <div>
          <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
            Categoría Padre
          </label>
          <Select
            id="parentId"
            {...register('parentId')}
            disabled={parentCategoriesLoading}
            error={errors.parentId?.message}
          >
            <option value="">-- Sin categoría padre --</option>
            {parentCategories?.map((category) => (
              // Evitar que una categoría sea su propio padre en modo edición
              isEdit && category.id === initialData?.id ? null : (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              )
            ))}
          </Select>
          {parentCategoriesLoading && (
            <p className="mt-1 text-sm text-gray-500">Cargando categorías...</p>
          )}
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <div className="flex items-center">
            <Input
              id="color"
              type="color"
              className="w-12 h-10 p-1 mr-2"
              {...register('color')}
            />
            <Input
              type="text"
              className="flex-1"
              value={selectedColor}
              onChange={(e) => setValue('color', e.target.value)}
              error={errors.color?.message}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Color para representar visualmente la categoría.
          </p>
        </div>

        <div>
          <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
            Icono
          </label>
          <Input
            id="icon"
            placeholder="Nombre del icono (ej: folder, book, etc.)"
            {...register('icon')}
            error={errors.icon?.message}
          />
          <p className="mt-1 text-xs text-gray-500">
            Opcional. Nombre del icono a mostrar. Por defecto se usa el icono de carpeta.
          </p>
        </div>

        <div className="flex items-center">
          <input
            id="isPublic"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            {...register('isPublic')}
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
            Categoría pública
          </label>
          <p className="ml-2 text-xs text-gray-500">
            Las categorías públicas son visibles para todos los usuarios.
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/categories')}
        >
          <XIcon className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        <Button 
          type="submit" 
          isLoading={isCreating || isUpdating}
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          {isEdit ? 'Actualizar' : 'Crear'} Categoría
        </Button>
      </div>
    </form>
  );
}