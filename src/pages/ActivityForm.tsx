import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { ArrowLeft, Save, Copy, FileText, Plus, Trash2 } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import toast from 'react-hot-toast';
import { atividadesService } from '../services/atividades';
import type { AtividadeData } from '../services/atividades';
import { ActivityPDF } from '../components/ActivityPDF';
import { format } from 'date-fns';

type AvaliacaoForm = {
  utente_id: string;
  grau_participacao: 'MB' | 'B' | 'S' | 'PS' | 'I';
  interesse_demonstrado: 'MB' | 'B' | 'S' | 'PS' | 'I';
  alcance_objetivos: 'MB' | 'B' | 'S' | 'PS' | 'I';
  utentes?: any; // Para renderização em modo visualização
};

type FormValues = AtividadeData & {
  avaliacoes: AvaliacaoForm[];
};

export default function ActivityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [utentesDb, setUtentesDb] = useState<any[]>([]);
  const [atividadeCarregada, setAtividadeCarregada] = useState<any>(null);
  
  const isViewMode = !!id;

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      data: format(new Date(), 'yyyy-MM-dd'),
      avaliacoes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'avaliacoes',
  });

  const avaliacoesWatch = useWatch({
    control,
    name: 'avaliacoes',
  });

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      await carregarDadosBase();
      if (id) {
        await carregarAtividade(id);
      } else if (state && state.cloneFrom) {
        try {
          const { atividade } = await atividadesService.getAtividade(state.cloneFrom);
          reset({
            ...atividade,
            data: format(new Date(), 'yyyy-MM-dd'),
            avaliacoes: [],
          });
        } catch (err) {
          console.error('Erro ao clonar atividade', err);
          toast.error('Não foi possível clonar a atividade.');
        }
      }
      setPageLoading(false);
    };
    fetchData();
  }, [id, state]);

  const carregarDadosBase = async () => {
    try {
      const uts = await atividadesService.getUtentes();
      setUtentesDb(uts);
    } catch (err) {
      console.error('Erro ao carregar utentes', err);
      toast.error('Erro ao carregar lista de utentes.');
    }
  };

  const carregarAtividade = async (idAtividade: string) => {
    try {
      const { atividade, avaliacoes } = await atividadesService.getAtividade(idAtividade);
      setAtividadeCarregada({ atividade, avaliacoes });
      reset({
        ...atividade,
        avaliacoes: avaliacoes,
      });
    } catch (err) {
      console.error('Erro ao carregar atividade', err);
      toast.error('Erro ao carregar os dados da atividade.');
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const { avaliacoes, ...restData } = data;
      // Remover o id do payload para garantir que o clone cria uma nova atividade
      const { id: formId, ...atividadeData } = restData as any;
      
      if (id) {
        await atividadesService.atualizarAtividadeComAvaliacoes(id, atividadeData, avaliacoes);
        toast.success('Atividade atualizada com sucesso!');
      } else {
        await atividadesService.criarAtividadeComAvaliacoes(atividadeData, avaliacoes);
        toast.success('Atividade criada com sucesso!');
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.message === 'UNIQUE_CONSTRAINT') {
        toast.error('Já existe uma atividade registada com exatamente a mesma Data, Local, Duração e Nome. Por favor, altere algum destes campos.', { duration: 6000 });
      } else {
        toast.error('Erro ao guardar atividade.');
      }
    } finally {
      setLoading(false);
    }
  };

  const duplicarAtividade = () => {
    const dados = getValues();
    // Limpar data e avaliações, manter textos base
    reset({
      ...dados,
      data: format(new Date(), 'yyyy-MM-dd'),
      avaliacoes: [],
    });
    navigate('/atividade/nova');
  };

  const notas = ['MB', 'B', 'S', 'PS', 'I'];

  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = window.confirm('Tem a certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.');
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await atividadesService.deleteAtividade(id);
      toast.success('Atividade excluída!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir atividade.');
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">A carregar a atividade...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white shadow-sm px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900 bg-gray-100 md:bg-transparent p-2 md:p-0 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800 text-center w-full md:text-left md:w-auto pr-8 md:pr-0">
            {isViewMode ? 'Detalhe da Atividade' : 'Nova Atividade'}
          </h1>
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3 w-full md:w-auto justify-center md:justify-end">
          {isViewMode && (
            <button
              onClick={handleDelete}
              className="flex justify-center items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg md:rounded hover:bg-red-700 transition flex-1 md:flex-none whitespace-nowrap"
              title="Excluir esta atividade permanentemente"
            >
              <Trash2 size={18} />
              Excluir
            </button>
          )}

          {isViewMode && atividadeCarregada && (
            <PDFDownloadLink
              document={<ActivityPDF atividade={atividadeCarregada.atividade} avaliacoes={atividadeCarregada.avaliacoes} />}
              fileName={`atividade_${atividadeCarregada.atividade.data}.pdf`}
              className="flex justify-center items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg md:rounded hover:bg-green-700 transition flex-1 md:flex-none whitespace-nowrap"
            >
              {({ loading }) => (
                <>
                  <FileText size={18} />
                  {loading ? 'A gerar...' : 'PDF'}
                </>
              )}
            </PDFDownloadLink>
          )}

          {isViewMode && (
            <button
              onClick={duplicarAtividade}
              className="flex justify-center items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg md:rounded hover:bg-indigo-700 transition flex-1 md:flex-none whitespace-nowrap"
              title="Copia os textos para um novo dia vazio"
            >
              <Copy size={18} />
              Duplicar
            </button>
          )}
          
          {(!isViewMode || isDirty) && (
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="flex justify-center items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg md:rounded hover:bg-blue-700 transition disabled:opacity-50 w-full md:w-auto whitespace-nowrap"
            >
              <Save size={18} />
              {loading ? 'A guardar...' : 'Guardar'}
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <form className="bg-white rounded-lg shadow-sm border md:border-none border-gray-200 p-4 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                {...register('data', { required: true })}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
              <select
                {...register('local', { required: true })}
                className="w-full border rounded-md p-2 bg-white"
              >
                <option value="">Selecione...</option>
                <option value="Sede ASAD">Sede ASAD</option>
                <option value="Exterior">Exterior</option>
                <option value="Online">Online</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
              <select
                {...register('duracao', { required: true })}
                className="w-full border rounded-md p-2 bg-white"
              >
                <option value="">Selecione...</option>
                <option value="1h">1 hora</option>
                <option value="2h">2 horas</option>
                <option value="3h">3 horas</option>
                <option value="Meio dia">Meio dia</option>
                <option value="Dia inteiro">Dia inteiro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Oficina</label>
              <input
                type="text"
                {...register('oficina', { required: true })}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Atividade</label>
              <input
                type="text"
                {...register('atividade_nome', { required: true })}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recursos Humanos</label>
              <textarea
                {...register('recursos_humanos', { required: true })}
                className="w-full border rounded-md p-2 h-20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos</label>
              <textarea
                {...register('objetivos', { required: true })}
                className="w-full border rounded-md p-2 h-20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Avaliação Global</label>
              <textarea
                {...register('avaliacao_global')}
                className="w-full border rounded-md p-2 h-20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dificuldades Sentidas</label>
              <textarea
                {...register('dificuldades')}
                className="w-full border rounded-md p-2 h-20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Outras Informações</label>
              <textarea
                {...register('outras_informacoes')}
                className="w-full border rounded-md p-2 h-20"
              />
            </div>
          </div>

          <hr className="my-8" />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Utentes e Avaliações</h3>
              <button
                type="button"
                onClick={() => append({ utente_id: '', grau_participacao: 'MB', interesse_demonstrado: 'MB', alcance_objetivos: 'MB' })}
                className="flex items-center gap-1 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
              >
                <Plus size={16} /> Adicionar Utente
              </button>
            </div>

            <div className="mt-4">
              {/* Desktop Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 bg-gray-50 p-4 rounded-t-md border-b text-xs font-medium text-gray-500">
                <div className="col-span-4">Utente</div>
                <div className="col-span-2 text-center">Participação</div>
                <div className="col-span-2 text-center">Interesse</div>
                <div className="col-span-2 text-center">Objetivos</div>
                <div className="col-span-2 text-center">Ações</div>
              </div>

              {/* Rows */}
              <div className="space-y-4 md:space-y-0 md:divide-y md:divide-gray-200">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border md:border-none md:border-b-0 rounded-lg p-4 shadow-sm md:shadow-none">
                    {/* Utente */}
                    <div className="col-span-1 md:col-span-4 flex flex-row items-center justify-between md:justify-start gap-4">
                      <span className="md:hidden font-medium text-sm text-gray-500 whitespace-nowrap">Utente</span>
                      <select
                        {...register(`avaliacoes.${index}.utente_id`, { required: true })}
                        className="w-full md:flex-1 border rounded p-1.5 text-sm bg-white"
                      >
                        <option value="">Selecione...</option>
                        {utentesDb.map(u => {
                          const isSelectedInOtherRow = avaliacoesWatch?.some(
                            (av, avIndex) => avIndex !== index && av.utente_id === u.id
                          );
                          if (isSelectedInOtherRow) return null;
                          return <option key={u.id} value={u.id}>{u.apelido}</option>;
                        })}
                      </select>
                    </div>

                    {/* Participação */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                      <span className="md:hidden text-sm text-gray-500">Participação</span>
                      <select
                        {...register(`avaliacoes.${index}.grau_participacao`, {
                          onChange: (e) => {
                            const val = e.target.value as any;
                            setValue(`avaliacoes.${index}.interesse_demonstrado`, val, { shouldDirty: true });
                            setValue(`avaliacoes.${index}.alcance_objetivos`, val, { shouldDirty: true });
                          }
                        })}
                        className="border rounded p-1.5 text-sm w-20 md:w-16 text-center bg-white"
                      >
                        {notas.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>

                    {/* Interesse */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                      <span className="md:hidden text-sm text-gray-500">Interesse</span>
                      <select
                        {...register(`avaliacoes.${index}.interesse_demonstrado`)}
                        className="border rounded p-1.5 text-sm w-20 md:w-16 text-center bg-white"
                      >
                        {notas.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>

                    {/* Objetivos */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                      <span className="md:hidden text-sm text-gray-500">Objetivos</span>
                      <select
                        {...register(`avaliacoes.${index}.alcance_objetivos`)}
                        className="border rounded p-1.5 text-sm w-20 md:w-16 text-center bg-white"
                      >
                        {notas.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>

                    {/* Remove Action */}
                    <div className="col-span-1 md:col-span-2 flex justify-end md:justify-center mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-none border-gray-100">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm bg-red-50 md:bg-transparent px-3 py-1.5 md:p-0 rounded"
                      >
                        <Trash2 size={16} /> <span className="md:hidden font-medium">Remover</span>
                      </button>
                    </div>
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className="p-8 text-center text-gray-500 text-sm md:border-t border-gray-200 bg-gray-50 rounded-lg md:rounded-none">
                    Nenhum utente adicionado a esta atividade.
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
