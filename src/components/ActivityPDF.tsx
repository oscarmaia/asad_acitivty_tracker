import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Registar fonte (opcional, mas recomendado se usar caracteres pt)
// Font.register({ family: 'Open Sans', src: 'https://fonts.gstatic.com/s/opensans/v18/mem8YaGs126MiZpBA-UFVZ0e.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleArea: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
    padding: 4,
    marginTop: 15,
    marginBottom: 5,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  col: {
    width: '50%',
    paddingRight: 10,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 9,
    color: '#444',
  },
  value: {
    fontSize: 10,
    marginBottom: 5,
  },
  textBlock: {
    marginBottom: 10,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '16.6%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f3f4f6',
    padding: 4,
  },
  tableColHeaderName: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f3f4f6',
    padding: 4,
  },
  tableColHeaderPres: {
    width: '9%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f3f4f6',
    padding: 4,
    textAlign: 'center',
  },
  tableColName: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
  },
  tableColPres: {
    width: '9%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    textAlign: 'center',
  },
  tableCol: {
    width: '16.6%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    textAlign: 'center',
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#888',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  }
});

interface ActivityPDFProps {
  atividade: any;
  avaliacoes: any[];
}

export const ActivityPDF = ({ atividade, avaliacoes }: ActivityPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
          <Text style={{ fontSize: 8 }}>LOGO ASAD</Text>
        </View>
        <View style={styles.titleArea}>
          <Text style={styles.title}>Associação de Apoio Social (ASAD)</Text>
          <Text style={styles.subtitle}>Relatório de Registo de Atividade</Text>
        </View>
      </View>

      {/* Dados da Atividade */}
      <Text style={styles.sectionTitle}>Identificação da Atividade</Text>
      
      <View style={styles.grid2}>
        <View style={styles.col}>
          <Text style={styles.label}>Data</Text>
          <Text style={styles.value}>{atividade.data ? format(new Date(atividade.data), 'dd/MM/yyyy') : ''}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Local</Text>
          <Text style={styles.value}>{atividade.local}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Duração</Text>
          <Text style={styles.value}>{atividade.duracao}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Oficina</Text>
          <Text style={styles.value}>{atividade.oficina}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Nome da Atividade</Text>
          <Text style={styles.value}>{atividade.atividade_nome}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Recursos Humanos</Text>
          <Text style={styles.value}>{atividade.recursos_humanos}</Text>
        </View>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Objetivos</Text>
        <Text style={styles.value}>{atividade.objetivos}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Avaliação Global</Text>
        <Text style={styles.value}>{atividade.avaliacao_global || 'N/A'}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Dificuldades Sentidas</Text>
        <Text style={styles.value}>{atividade.dificuldades || 'N/A'}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.label}>Outras Informações</Text>
        <Text style={styles.value}>{atividade.outras_informacoes || 'N/A'}</Text>
      </View>

      {/* Tabela de Utentes e Avaliações */}
      <Text style={styles.sectionTitle}>Utentes e Avaliação</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeaderName}>
            <Text style={styles.tableCellHeader}>Nome</Text>
          </View>
          <View style={styles.tableColHeaderPres}>
            <Text style={styles.tableCellHeader}>Pres.</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Participação</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Interesse</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Objetivos</Text>
          </View>
        </View>

        {avaliacoes.map((av, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableColName}>
              <Text style={styles.tableCell}>{av.utentes?.nome} {av.utentes?.apelido}</Text>
            </View>
            <View style={styles.tableColPres}>
              <Text style={styles.tableCell}>X</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{av.grau_participacao}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{av.interesse_demonstrado}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{av.alcance_objetivos}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        ASAD - Associação de Apoio Social | NIPC: 500000000 | Morada: Rua Exemplo, 123, 1000-000 Lisboa | Contacto: 210000000
      </Text>
    </Page>
  </Document>
);
