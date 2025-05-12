// src/components/categories/CategoryForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon, XIcon, InfoIcon } from 'lucide-react';
import { Category } from '@/services/categoryService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { 
  useCategories, 
  useRootCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useSystemCategories 
} from '@/hooks/useCategoryOperations';

// Esquema de validación para el formulario
const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  parentId: z.string().min(1, 'Debes seleccionar una categoría padre'),
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
  const [info, setInfo] = useState<string | null>(null);
  
  // Hooks para crear/actualizar categorías
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory(initialData?.id || '');
  
  // Hooks para obtener categorías 
  const { data: allCategories, isLoading: categoriesLoading } = useCategories();
  const { data: systemCategories, isLoading: systemCategoriesLoading } = useSystemCategories();
  
  // Estado para las categorías padres disponibles
  const [availableParents, setAvailableParents] = useState<Category[]>([]);

  // Actualizar las categorías padres disponibles cuando cambien las categorías
  useEffect(() => {
    if (allCategories) {
      // Filtrar las categorías que pueden ser padres:
      // 1. Categorías del sistema
      // 2. Categorías propias del usuario (excepto la categoría actual en modo edición)
      const filteredParents = allCategories.filter(category => {
        // Evitar que una categoría sea su propio padre en modo edición
        if (isEdit && initialData?.id === category.id) {
          return false;
        }
        
        // Incluir categorías del sistema y categorías propias
        return category.isSystem || true;
      });
      
      setAvailableParents(filteredParents);
      
      // Si es un formulario de creación nueva, mostrar mensaje informativo
      if (!isEdit) {
        setInfo('Solo puedes crear subcategorías bajo las categorías existentes.');
      }
    }
  }, [allCategories, initialData, isEdit]);

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
  const selectedParentId = watch('parentId');

  // Obtener información sobre la categoría padre seleccionada
  const selectedParent = availableParents.find(category => category.id === selectedParentId);
  const isSystemParent = selectedParent?.isSystem || false;

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    try {
      setError(null);

      // Limpiar y preparar los datos del formulario
      const formData = {
        ...data,
        name: data.name.trim(), // Eliminar espacios en blanco
        description: data.description?.trim() || undefined,
        // Asegurarse de que parentId sea un string válido
        parentId: data.parentId.trim(),
        // Asegurarse de que color sea un string válido
        color: data.color && data.color.trim() !== '' ? data.color : undefined,
        // Asegurarse de que icon sea un string válido
        icon: data.icon && data.icon.trim() !== '' ? data.icon : undefined,
        // Asegurarse de que isPublic sea un booleano
        isPublic: Boolean(data.isPublic)
      };

      console.log('Enviando datos de categoría:', formData);

      if (isEdit && initialData?.id) {
        await updateCategory(formData);
      } else {
        await createCategory(formData);
      }

      router.push('/dashboard/categories');
    } catch (err: any) {
      console.error('Error submitting category:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al guardar la categoría';
      setError(errorMessage);
    }
  };

  const isParentCategorySystem = () => {
    const parent = availableParents.find(cat => cat.id === selectedParentId);
    return parent?.isSystem || false;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}
      
      {info && (
        <Alert variant="warning">
          <InfoIcon className="h-4 w-4 mr-2" />
          {info}
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría Padre *
          </label>
          <Select
            id="parentId"
            {...register('parentId')}
            disabled={categoriesLoading || isEdit}
            error={errors.parentId?.message}
          >
            <option value="">-- Selecciona una categoría padre --</option>
            
            {/* Grupo de categorías del sistema */}
            <optgroup label="Categorías del Sistema">
              {availableParents
                .filter(category => category.isSystem)
                .map(category => (
                  <option 
                    key={category.id || `system-category-${category.name}`} 
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))
              }
            </optgroup>
            
            {/* Grupo de categorías personales */}
            {availableParents.some(category => !category.isSystem) && (
              <optgroup label="Mis Categorías">
                {availableParents
                  .filter(category => !category.isSystem)
                  .map(category => (
                    <option 
                      key={category.id || `user-category-${category.name}`} 
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))
                }
              </optgroup>
            )}
          </Select>
          
          {isEdit && (
            <p className="mt-1 text-xs text-gray-500">
              No puedes cambiar la categoría padre una vez creada la categoría.
            </p>
          )}
          
          {isParentCategorySystem() && (
            <p className="mt-1 text-xs text-emerald-600">
              Estás creando una subcategoría bajo una categoría del sistema.
            </p>
          )}
          
          {categoriesLoading && (
            <p className="mt-1 text-sm text-gray-500">Cargando categorías...</p>
          )}
        </div>

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
            Hacer subcategoría pública
          </label>
          <p className="ml-2 text-xs text-gray-500">
            Si marcas esta opción, otros usuarios podrán ver esta subcategoría.
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
          {isEdit ? 'Actualizar' : 'Crear'} Subcategoría
        </Button>
      </div>
    </form>
  );
}