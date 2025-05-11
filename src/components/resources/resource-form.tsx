// src/components/resources/resource-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { 
  FileIcon, 
  UploadIcon, 
  SaveIcon, 
  LinkIcon,
  X 
} from 'lucide-react';
import { Resource, ResourceType } from '@/types/resource';
import { resourceService } from '@/services/resourceService';
import { categoryService } from '@/services/categoryService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { TagInput } from '@/components/tags/tag-input';
import { Alert } from '@/components/ui/alert';
import { useCategories } from '@/hooks/useCategories';

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

interface ResourceFormProps {
  initialData?: Partial<Resource>;
  isEdit?: boolean;
}

export function ResourceForm({ initialData, isEdit = false }: ResourceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { categories, isLoading: categoriesLoading } = useCategories();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || ResourceType.DOCUMENTATION,
      content: initialData?.content || '',
      url: initialData?.url || '',
      categoryId: initialData?.categoryId || '',
      tags: initialData?.tags || [],
      isPublic: initialData?.isPublic || false,
    },
  });

  const resourceType = watch('type');

  // Configuración de Dropzone para subir archivos
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
    multiple: false,
  });

  const onSubmit = async (data: ResourceFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Si hay un archivo seleccionado, subir primero
      if (selectedFile) {
        await resourceService.uploadResource(selectedFile, { 
          ...data,
          type: resourceType,
        });
      } else if (isEdit && initialData?.id) {
        // Actualizar recurso existente
        await resourceService.updateResource(initialData.id, data);
      } else {
        // Crear nuevo recurso sin archivo
        await resourceService.createResource(data);
      }

      router.push('/dashboard/resources');
      router.refresh();
    } catch (err: any) {
      console.error('Error submitting resource:', err);
      setError(err.response?.data?.message || 'Error al guardar el recurso');
    } finally {
      setIsSubmitting(false);
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
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="url"
                className="pl-10"
                placeholder="https://example.com"
                {...register('url')}
                error={errors.url?.message}
              />
            </div>
          </div>
        )}

        {(resourceType === ResourceType.DOCUMENTATION || resourceType === ResourceType.TUTORIAL) && (
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Contenido
            </label>
            <Textarea
              id="content"
              rows={8}
              {...register('content')}
              error={errors.content?.message}
            />
          </div>
        )}

        {(resourceType === ResourceType.FILE || resourceType === ResourceType.VIDEO) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo
            </label>
            <div {...getRootProps()} className="cursor-pointer">
              <Card className={`p-6 border-2 border-dashed ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'} text-center`}>
                <input {...getInputProps()} />
                {selectedFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileIcon className="h-8 w-8 text-primary-500 mr-2" />
                      <div className="text-left">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <UploadIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo, o haz clic para seleccionarlo'}
                    </p>
                  </div>
                )}
              </Card>
            </div>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/resources')}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          <SaveIcon className="mr-2 h-4 w-4" />
          {isEdit ? 'Actualizar' : 'Crear'} Recurso
        </Button>
      </div>
    </form>
  );
}