import { supabase } from '../lib/supabase/client';

export type AtividadeData = {
  data: string;
  local: string;
  duracao: string;
  oficina: string;
  atividade_nome: string;
  recursos_humanos: string;
  objetivos: string;
  avaliacao_global?: string;
  dificuldades?: string;
  outras_informacoes?: string;
};

export type AvaliacaoData = {
  utente_id: string;
  grau_participacao: 'MB' | 'B' | 'S' | 'PS' | 'I';
  interesse_demonstrado: 'MB' | 'B' | 'S' | 'PS' | 'I';
  alcance_objetivos: 'MB' | 'B' | 'S' | 'PS' | 'I';
};

export const atividadesService = {
  async getAtividades() {
    const { data, error } = await supabase
      .from('atividades')
      .select('*')
      .order('data', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getUtentes() {
    const { data, error } = await supabase
      .from('utentes')
      .select('*')
      .eq('ativo', true)
      .order('nome', { ascending: true });
      
    if (error) throw error;
    return data;
  },

  async getAtividade(id: string) {
    const { data: atividade, error: atividadeError } = await supabase
      .from('atividades')
      .select('*')
      .eq('id', id)
      .single();
      
    if (atividadeError) throw atividadeError;

    const { data: avaliacoes, error: avaliacoesError } = await supabase
      .from('avaliacoes')
      .select(`
        *,
        utentes (
          nome,
          alcunha
        )
      `)
      .eq('atividade_id', id);
      
    if (avaliacoesError) throw avaliacoesError;

    return { atividade, avaliacoes };
  },

  async checkUniqueness(atividade: AtividadeData, excludeId?: string) {
    let query = supabase
      .from('atividades')
      .select('id')
      .eq('data', atividade.data)
      .eq('local', atividade.local)
      .eq('duracao', atividade.duracao)
      .eq('atividade_nome', atividade.atividade_nome);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    if (data && data.length > 0) {
      throw new Error('UNIQUE_CONSTRAINT');
    }
  },

  /**
   * Insere uma Atividade e as suas Avaliações numa única transação "simulada" 
   * ou duas queries seguidas (como é cliente frontend, fazemos em 2 passos seguidos).
   */
  async criarAtividadeComAvaliacoes(atividade: AtividadeData, avaliacoes: AvaliacaoData[]) {
    await this.checkUniqueness(atividade);

    // 1. Inserir a Atividade e obter o ID retornado
    const { data: atividadeInserida, error: erroAtividade } = await supabase
      .from('atividades')
      .insert([atividade])
      .select()
      .single();

    if (erroAtividade) {
      console.error('Erro ao inserir atividade', erroAtividade);
      throw new Error(erroAtividade.message);
    }

    // 2. Se houver avaliações, associar o atividade_id e inserir em bulk
    if (avaliacoes && avaliacoes.length > 0) {
      const avaliacoesParaInserir = avaliacoes.map(av => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        const { utentes, id, created_at, atividade_id, ...resto } = av as any;
        return {
          ...resto,
          atividade_id: atividadeInserida.id,
        };
      });

      const { error: erroAvaliacoes } = await supabase
        .from('avaliacoes')
        .insert(avaliacoesParaInserir);

      if (erroAvaliacoes) {
        console.error('Erro ao inserir avaliações', erroAvaliacoes);
        // Em caso de falha severa na junção, podemos querer fazer "rollback" apagando a atividade
        await supabase.from('atividades').delete().eq('id', atividadeInserida.id);
        throw new Error(erroAvaliacoes.message);
      }
    }

    return atividadeInserida;
  },

  async atualizarAtividadeComAvaliacoes(id: string, atividade: AtividadeData, avaliacoes: AvaliacaoData[]) {
    await this.checkUniqueness(atividade, id);

    // 1. Atualizar a Atividade
    const { error: erroAtividade } = await supabase
      .from('atividades')
      .update(atividade)
      .eq('id', id);

    if (erroAtividade) {
      console.error('Erro ao atualizar atividade', erroAtividade);
      throw new Error(erroAtividade.message);
    }

    // 2. Eliminar avaliações antigas
    const { error: erroDelete } = await supabase
      .from('avaliacoes')
      .delete()
      .eq('atividade_id', id);

    if (erroDelete) {
      console.error('Erro ao eliminar avaliações antigas', erroDelete);
      throw new Error(erroDelete.message);
    }

    // 3. Inserir novas avaliações
    if (avaliacoes && avaliacoes.length > 0) {
      const avaliacoesParaInserir = avaliacoes.map(av => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        const { utentes, id: _avId, created_at, atividade_id, ...resto } = av as any;
        return {
          ...resto,
          atividade_id: id,
        };
      });

      const { error: erroAvaliacoes } = await supabase
        .from('avaliacoes')
        .insert(avaliacoesParaInserir);

      if (erroAvaliacoes) {
        console.error('Erro ao inserir novas avaliações', erroAvaliacoes);
        throw new Error(erroAvaliacoes.message);
      }
    }
  },

  async deleteAtividade(id: string) {
    // Avaliações are cascaded via DB foreign keys normally, 
    // but just in case, we can delete them explicitly or let Supabase do it.
    const { error: erroAvaliacoes } = await supabase
      .from('avaliacoes')
      .delete()
      .eq('atividade_id', id);

    if (erroAvaliacoes) {
      console.error('Erro ao eliminar avaliações da atividade', erroAvaliacoes);
      throw new Error(erroAvaliacoes.message);
    }

    const { error: erroAtividade } = await supabase
      .from('atividades')
      .delete()
      .eq('id', id);

    if (erroAtividade) {
      console.error('Erro ao eliminar atividade', erroAtividade);
      throw new Error(erroAtividade.message);
    }
  }
};
