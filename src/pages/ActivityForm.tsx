import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, Copy, FileText, Plus, Trash2 } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
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
  const [loading, setLoading] = useState(false);
  const [utentesDb, setUtentesDb] = useState<any[]>([]);
  const [atividadeCarregada, setAtividadeCarregada] = useState<any>(null);
  
  const isViewMode = !!id;

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
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

  useEffect(() => {
    carregarDadosBase();
    if (id) {
      carregarAtividade(id);
    }
  }, [id]);

  const carregarDadosBase = async () => {
    try {
      const uts = await atividadesService.getUtentes();
      setUtentesDb(uts);
    } catch (err) {
      console.error('Erro ao carregar utentes', err);
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
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (isViewMode) return; // Por enquanto, não permitimos editar após guardar para simplificar (requisito fala em registo e duplicação)
    
    setLoading(true);
    try {
      const { avaliacoes, ...atividadeData } = data;
      await atividadesService.criarAtividadeComAvaliacoes(atividadeData, avaliacoes);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Erro ao guardar atividade.');
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-800">
            {isViewMode ? 'Detalhe da Atividade' : 'Nova Atividade'}
          </h1>
        </div>
        
        <div className="flex gap-3">
          {isViewMode && atividadeCarregada && (
            <PDFDownloadLink
              document={<ActivityPDF atividade={atividadeCarregada.atividade} avaliacoes={atividadeCarregada.avaliacoes} />}
              fileName={`atividade_${atividadeCarregada.atividade.data}.pdf`}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
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
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              title="Copia os textos para um novo dia vazio"
            >
              <Copy size={18} />
              Duplicar
            </button>
          )}
          
          {!isViewMode && (
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'A guardar...' : 'Guardar'}
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <form className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                {...register('data', { required: true })}
                disabled={isViewMode}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
              <select
                {...register('local', { required: true })}
                disabled={isViewMode}
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
                disabled={isViewMode}
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
                disabled={isViewMode}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Atividade</label>
              <input
                type="text"
                {...register('atividade_nome', { required: true })}
                disabled={isViewMode}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recursos Humanos</label>
              <textarea
                {...register('recursos_humanos', { required: true })}
                disabled={isViewMode}
                className="w-full border rounded-md p-2 h-20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos</label>
              <textarea
                {...register('objetivos', { required: true })}
                disabled={isViewMode}
                className="w-full border rounded-md p-2 h-20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Avaliação Global</label>
              <textarea
                {...register('avaliacao_global')}
                disabled={isViewMode}
                className="w-full border rounded-md p-2 h-20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dificuldades Sentidas</label>
              <textarea
                {...register('dificuldades')}
                disabled={isViewMode}
                className="w-full border rounded-md p-2 h-20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Outras Informações</label>
              <textarea
                {...register('outras_informacoes')}
                disabled={isViewMode}
                className="w-full border rounded-md p-2 h-20"
              />
            </div>
          </div>

          <hr className="my-8" />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Utentes e Avaliações</h3>
              {!isViewMode && (
                <button
                  type="button"
                  onClick={() => append({ utente_id: '', grau_participacao: 'MB', interesse_demonstrado: 'MB', alcance_objetivos: 'MB' })}
                  className="flex items-center gap-1 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                >
                  <Plus size={16} /> Adicionar Utente
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Utente</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Participação</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Interesse</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Objetivos</th>
                    {!isViewMode && <th className="px-4 py-3"></th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map((field, index) => (
                    <tr key={field.id}>
                      <td className="px-4 py-3">
                        {isViewMode ? (
                          <span className="text-sm">
                            {field.utentes?.nome} {field.utentes?.apelido}
                          </span>
                        ) : (
                          <select
                            {...register(`avaliacoes.${index}.utente_id`, { required: true })}
                            className="w-full border rounded p-1 text-sm"
                          >
                            <option value="">Selecione...</option>
                            {utentesDb.map(u => (
                              <option key={u.id} value={u.id}>{u.nome} {u.apelido}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          {...register(`avaliacoes.${index}.grau_participacao`)}
                          disabled={isViewMode}
                          className="border rounded p-1 text-sm w-16 text-center"
                        >
                          {notas.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          {...register(`avaliacoes.${index}.interesse_demonstrado`)}
                          disabled={isViewMode}
                          className="border rounded p-1 text-sm w-16 text-center"
                        >
                          {notas.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <select
                          {...register(`avaliacoes.${index}.alcance_objetivos`)}
                          disabled={isViewMode}
                          className="border rounded p-1 text-sm w-16 text-center"
                        >
                          {notas.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </td>
                      {!isViewMode && (
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {fields.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                        Nenhum utente adicionado a esta atividade. Se o utente não for adicionado, será considerado ausente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
