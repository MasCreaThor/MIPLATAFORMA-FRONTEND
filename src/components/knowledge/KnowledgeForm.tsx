// src/components/knowledge/KnowledgeForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon, InfoIcon } from 'lucide-react';
import { KnowledgeItem, KnowledgeItemType, SolutionDetails } from '@/types/knowledge';
import { knowledgeService } from '@/services/knowledgeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { TagInput } from '@/components/tags/tag-input';
import { CodeEditor } from '@/components/shared/CodeEditor';
import { Category, useCategories } from '@/hooks/useCategories';
import { LoadingSpinner } from '@/components/ui/skeleton';

// Esquema de validación para el formulario
const knowledgeItemSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  type: z.nativeEnum(KnowledgeItemType),
  categoryId: z.string().optional().or(z.literal('')),
  content: z.string().optional(),
  codeContent: z.string().optional(),
  codeLanguage: z.string().optional(),
  solutionDetails: z.object({
    problem: z.string().optional(),
    solution: z.string().optional(),
    context: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean(),
});

type KnowledgeFormData = z.infer<typeof knowledgeItemSchema>;

interface KnowledgeFormProps {
  initialData?: Partial<KnowledgeItem>;
  isEdit?: boolean;
}

export function KnowledgeForm({ initialData, isEdit = false }: KnowledgeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Usamos requireAuth: false para obtener categorías incluso sin autenticación
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories({ requireAuth: false });

  // Inicializar formulario con datos existentes o valores por defecto
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<KnowledgeFormData>({
    resolver: zodResolver(knowledgeItemSchema),
    defaultValues: {
      title: initialData?.title || '',
      type: initialData?.type || KnowledgeItemType.NOTE,
      categoryId: initialData?.categoryId || '',
      content: initialData?.content || '',
      codeContent: initialData?.codeContent || '',
      codeLanguage: initialData?.codeLanguage || 'javascript',
      solutionDetails: initialData?.solutionDetails || {
        problem: '',
        solution: '',
        context: '',
      },
      tags: initialData?.tags || [],
      isPublic: initialData?.isPublic || false,
    },
  });

  const itemType = watch('type');

  // Manejar cambios en el editor de código
  const handleCodeChange = (value: string) => {
    setValue('codeContent', value, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<KnowledgeFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Crear o actualizar elemento
      if (isEdit && initialData?.id) {
        await knowledgeService.updateKnowledgeItem(initialData.id, data);
      } else {
        await knowledgeService.createKnowledgeItem(data);
      }

      router.push('/dashboard/knowledge');
    } catch (err: any) {
      console.error('Error submitting knowledge item:', err);
      setError(err.response?.data?.message || 'Error al guardar el elemento de conocimiento');
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

      {categoriesError && (
        <Alert variant="warning">
          <InfoIcon className="h-4 w-4 mr-2" />
          Hubo un problema al cargar las categorías. Puedes continuar sin seleccionar una categoría o intentar más tarde.
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
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo de Elemento *
          </label>
          <Select
            id="type"
            {...register('type')}
            error={errors.type?.message}
          >
            <option value={KnowledgeItemType.WIKI}>Wiki</option>
            <option value={KnowledgeItemType.NOTE}>Nota</option>
            <option value={KnowledgeItemType.SNIPPET}>Snippet de Código</option>
            <option value={KnowledgeItemType.COMMAND}>Comando</option>
            <option value={KnowledgeItemType.SOLUTION}>Solución</option>
          </Select>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          {categoriesLoading ? (
            <div className="h-10 flex items-center">
              <LoadingSpinner />
              <span className="ml-2 text-sm text-gray-500">Cargando categorías...</span>
            </div>
          ) : (
            <Select
              id="categoryId"
              {...register('categoryId')}
              disabled={categoriesLoading || !!categoriesError}
              error={errors.categoryId?.message}
            >
              <option value="">-- Selecciona una categoría --</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} {category.isPublic ? '(Pública)' : ''}
                </option>
              ))}
            </Select>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {categories && categories.length === 0 ? 'No hay categorías disponibles.' : ''}
          </p>
        </div>

        {/* Contenido específico según el tipo */}
        {(itemType === KnowledgeItemType.WIKI || itemType === KnowledgeItemType.NOTE) && (
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Contenido
            </label>
            <Textarea
              id="content"
              rows={10}
              {...register('content')}
              error={errors.content?.message}
            />
          </div>
        )}

        {(itemType === KnowledgeItemType.SNIPPET || itemType === KnowledgeItemType.COMMAND) && (
          <>
            <div>
              <label htmlFor="codeLanguage" className="block text-sm font-medium text-gray-700">
                Lenguaje
              </label>
              <Select
                id="codeLanguage"
                {...register('codeLanguage')}
                error={errors.codeLanguage?.message}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="bash">Bash</option>
                <option value="sql">SQL</option>
              </Select>
            </div>
            <div>
              <label htmlFor="codeContent" className="block text-sm font-medium text-gray-700">
                Código
              </label>
              <CodeEditor
                value={watch('codeContent') || ''}
                language={watch('codeLanguage') || 'javascript'}
                onChange={handleCodeChange}
                height="300px"
              />
              {errors.codeContent?.message && (
                <p className="mt-1 text-sm text-red-500">{errors.codeContent.message}</p>
              )}
            </div>
          </>
        )}

        {itemType === KnowledgeItemType.SOLUTION && (
          <>
            <div>
              <label htmlFor="problem" className="block text-sm font-medium text-gray-700">
                Problema
              </label>
              <Textarea
                id="problem"
                rows={5}
                {...register('solutionDetails.problem')}
                error={errors.solutionDetails?.problem?.message}
              />
            </div>
            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
                Solución
              </label>
              <Textarea
                id="solution"
                rows={8}
                {...register('solutionDetails.solution')}
                error={errors.solutionDetails?.solution?.message}
              />
            </div>
            <div>
              <label htmlFor="context" className="block text-sm font-medium text-gray-700">
                Contexto
              </label>
              <Textarea
                id="context"
                rows={3}
                {...register('solutionDetails.context')}
                error={errors.solutionDetails?.context?.message}
              />
            </div>
          </>
        )}

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
            Elemento público
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/knowledge')}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          <SaveIcon className="mr-2 h-4 w-4" />
          {isEdit ? 'Actualizar' : 'Crear'} Elemento
        </Button>
      </div>
    </form>
  );
}