// src/components/resources/CreateResourceDialog.tsx
'use client';

import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resource, ResourceType } from '@/types/resource';
import { resourceService } from '@/services/resourceService'; // Actualizado a resourceService
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { TagInput } from '@/components/tags/tag-input';
import { Alert } from '@/components/ui/alert';
import { useCategories } from '@/hooks/useCategories';

interface CreateResourceDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (resource: Resource) => void;
}

// Esquema de validación para el formulario
const resourceSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  type: z.nativeEnum(ResourceType),
  content: z.string().optional(),
  url: z.string().url('URL inválida').optional().or(z.literal('')),
  categoryId: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

export function CreateResourceDialog({ open, onClose, onCreate }: CreateResourceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { categories, isLoading: categoriesLoading } = useCategories();

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: '',
      description: '',
      type: ResourceType.DOCUMENTATION,
      content: '',
      url: '',
      categoryId: '',
      tags: [],
      isPublic: false,
    },
  });

  const resourceType = watch('type');

  const onSubmit = async (data: ResourceFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const createdResource = await resourceService.createResource(data);
      onCreate(createdResource);
      reset();
      onClose();
    } catch (err: any) {
      console.error('Error creating resource:', err);
      setError(err.response?.data?.message || 'Error al crear el recurso');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Cerrar</span>
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Crear Nuevo Recurso
            </h3>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título *
                </label>
                <Input
                  id="title"
                  {...register('title')}
                  error={errors.title?.message}
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
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Tipo de Recurso *
                </label>
                <Select
                  id="type"
                  {...register('type')}
                  error={errors.type?.message}
                >
                  <option value={ResourceType.DOCUMENTATION}>Documentación</option>
                  <option value={ResourceType.TUTORIAL}>Tutorial</option>
                  <option value={ResourceType.LINK}>Enlace</option>
                  <option value={ResourceType.FILE}>Archivo</option>
                  <option value={ResourceType.VIDEO}>Video</option>
                </Select>
              </div>

              {resourceType === ResourceType.LINK && (
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    URL *
                  </label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    {...register('url')}
                    error={errors.url?.message}
                  />
                </div>
              )}

              {(resourceType === ResourceType.DOCUMENTATION || resourceType === ResourceType.TUTORIAL) && (
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Contenido
                  </label>
                  <Textarea
                    id="content"
                    rows={5}
                    {...register('content')}
                    error={errors.content?.message}
                  />
                </div>
              )}

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <Select
                  id="categoryId"
                  {...register('categoryId')}
                  disabled={categoriesLoading}
                  error={errors.categoryId?.message}
                >
                  <option value="">-- Selecciona una categoría --</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Etiquetas
                </label>
                <TagInput
                  value={watch('tags') || []}
                  onChange={(tags) => setValue('tags', tags, { shouldValidate: true })}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="isPublic"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  {...register('isPublic')}
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                  Recurso público
                </label>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="sm:ml-3"
                >
                  Crear
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="mt-3 sm:mt-0"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}