import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { atividadesService } from '../services/atividades';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, Search, Edit2, Copy, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { pdf } from '@react-pdf/renderer';
import { ActivityPDF } from '../components/ActivityPDF';
import { getPdfFilename } from '../utils/pdfHelper';

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [atividades, setAtividades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAtividades();
  }, []);

  const loadAtividades = async () => {
    try {
      const data = await atividadesService.getAtividades();
      setAtividades(data);
    } catch (error) {
      console.error('Erro ao carregar atividades', error);
      toast.error('Erro ao carregar a lista de atividades.');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async (id: string) => {
    try {
      setLoading(true);
      await atividadesService.deleteAtividade(id);
      toast.success('Atividade excluída com sucesso!');
      await loadAtividades();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir atividade.');
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    toast(
      (t) => (
        <div>
          <p className="mb-3 font-medium text-gray-800">Tem a certeza que deseja excluir esta atividade?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 font-medium transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                executeDelete(id);
              }}
              className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 font-medium transition"
            >
              Excluir
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  const handleDuplicate = (id: string) => {
    navigate('/atividade/nova', { state: { cloneFrom: id } });
  };

  const handleDownloadPDF = async (id: string) => {
    const loadingToast = toast.loading('A gerar PDF...');
    try {
      const { atividade, avaliacoes } = await atividadesService.getAtividade(id);
      const blob = await pdf(<ActivityPDF atividade={atividade} avaliacoes={avaliacoes} />).toBlob();
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getPdfFilename(atividade);
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('PDF gerado com sucesso!', { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error('Erro ao gerar PDF.', { id: loadingToast });
    }
  };

  const filteredAtividades = atividades.filter(
    (a) =>
      a.atividade_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.oficina.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.data.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
          <h1 className="text-xl font-bold text-gray-800 w-full text-center md:text-left md:w-auto">ASAD - Gestão</h1>
          <div className="flex gap-4 w-full justify-center md:w-auto md:justify-start border-b pb-2 md:border-b-0 md:pb-0 border-gray-100">
            <Link to="/" className="text-blue-600 font-medium">Atividades</Link>
            <Link to="/utentes" className="text-gray-500 hover:text-blue-600">Utentes</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full justify-between md:w-auto md:justify-end">
          <span className="text-sm text-gray-600 truncate max-w-[200px] md:max-w-none">{user?.email}</span>
          <button onClick={signOut} className="text-gray-500 hover:text-red-600 flex items-center gap-1" title="Sair">
            <LogOut size={20} /> <span className="text-sm md:hidden">Sair</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6 md:mb-8">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/atividade/nova"
            className="flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
          >
            <PlusCircle size={20} />
            Nova Atividade
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm font-medium">A carregar atividades...</p>
          </div>
        ) : (
          <div className="bg-transparent md:bg-white md:rounded-lg md:shadow overflow-hidden">
            <div className="hidden md:grid md:grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">Data</div>
              <div className="col-span-3">Nome da Atividade</div>
              <div className="col-span-3">Oficina</div>
              <div className="col-span-2">Local</div>
              <div className="col-span-2 text-right">Ações</div>
            </div>

            <div className="space-y-4 md:space-y-0 md:divide-y md:divide-gray-200">
              {filteredAtividades.map((atividade) => (
                <div key={atividade.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white rounded-lg md:rounded-none shadow-sm md:shadow-none p-4 md:px-6 md:py-4 hover:bg-gray-50 transition border border-gray-200 md:border-none">
                  {/* Data */}
                  <div className="col-span-1 md:col-span-2 flex justify-between md:block items-center border-b border-gray-100 md:border-none pb-2 md:pb-0">
                    <span className="text-xs font-medium text-gray-500 md:hidden uppercase">Data</span>
                    <span className="text-sm text-gray-900">{format(new Date(atividade.data), 'dd/MM/yyyy')}</span>
                  </div>
                  
                  {/* Nome da Atividade */}
                  <div className="col-span-1 md:col-span-3 flex justify-between md:block items-center border-b border-gray-100 md:border-none py-2 md:py-0">
                    <span className="text-xs font-medium text-gray-500 md:hidden uppercase">Nome da Atividade</span>
                    <span className="text-sm font-bold md:font-medium text-gray-900 text-right md:text-left line-clamp-2 md:line-clamp-none">{atividade.atividade_nome}</span>
                  </div>

                  {/* Oficina */}
                  <div className="col-span-1 md:col-span-3 flex justify-between md:block items-center border-b border-gray-100 md:border-none py-2 md:py-0">
                    <span className="text-xs font-medium text-gray-500 md:hidden uppercase">Oficina</span>
                    <span className="text-sm text-gray-500">{atividade.oficina}</span>
                  </div>

                  {/* Local */}
                  <div className="col-span-1 md:col-span-2 flex justify-between md:block items-center border-b border-gray-100 md:border-none py-2 md:py-0">
                    <span className="text-xs font-medium text-gray-500 md:hidden uppercase">Local</span>
                    <span className="text-sm text-gray-500">{atividade.local}</span>
                  </div>

                  {/* Ações */}
                  <div className="col-span-1 md:col-span-2 flex justify-end md:justify-end items-center gap-2 pt-2 md:pt-0">
                    <button 
                      onClick={() => handleDownloadPDF(atividade.id)}
                      className="p-1.5 md:p-2 text-green-600 hover:bg-green-50 rounded-md transition" 
                      title="Gerar PDF"
                    >
                      <FileText size={18} />
                    </button>
                    <button 
                      onClick={() => handleDuplicate(atividade.id)}
                      className="p-1.5 md:p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition" 
                      title="Duplicar"
                    >
                      <Copy size={18} />
                    </button>
                    <Link 
                      to={`/atividade/${atividade.id}`} 
                      className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-md transition" 
                      title="Ver / Editar"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(atividade.id)}
                      className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-md transition" 
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredAtividades.length === 0 && (
                <div className="px-6 py-10 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
                  Nenhuma atividade encontrada.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
