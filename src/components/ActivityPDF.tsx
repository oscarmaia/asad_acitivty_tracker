import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

const BORDER_COLOR = '#000';
const BG_GREEN = '#c5e0b4';
const BORDER_WIDTH = 1;

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 10,
    marginRight: 10,
  },
  logo: {
    width: 70,
    height: 70,
    objectFit: 'contain',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  table: {
    width: '100%',
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    borderStyle: 'solid',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    minHeight: 25,
  },
  lastRow: {
    flexDirection: 'row',
    minHeight: 25,
  },
  // Section 1 columns
  colLabel: {
    backgroundColor: BG_GREEN,
    padding: 4,
    fontWeight: 'bold',
    borderRightWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
  },
  colValue: {
    padding: 4,
    borderRightWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
  },
  colValueLast: {
    padding: 4,
    justifyContent: 'center',
  },
  
  // Utentes Headers
  utentesHeaderLabel: {
    backgroundColor: BG_GREEN,
    padding: 4,
    fontWeight: 'bold',
    borderRightWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  utentesHeaderLabelLast: {
    backgroundColor: BG_GREEN,
    padding: 4,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  // Utentes Row Cells
  utentesCell: {
    padding: 4,
    borderRightWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  utentesCellLeft: {
    padding: 4,
    borderRightWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    justifyContent: 'center',
  },
  utentesCellLast: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  // Legend and Footer
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    fontSize: 8,
    fontWeight: 'bold',
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 7,
    color: '#000',
  }
});

interface ActivityPDFProps {
  atividade: any;
  avaliacoes: any[];
}

export const ActivityPDF = ({ atividade, avaliacoes }: ActivityPDFProps) => {
  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.headerTop}>
          <Text style={styles.headerText}>Associação Social de Apoio à Deficiência</Text>
          <Image src="/asad.jpg" style={styles.logo} />
        </View>

        <Text style={styles.title}>REGISTO DE ATIVIDADES (OFICINAS)</Text>

        <View style={styles.table}>
          
          {/* Row 1: Data, Local, Duração */}
          <View style={styles.row}>
            <View style={[styles.colLabel, { width: '10%' }]}>
              <Text>Data:</Text>
            </View>
            <View style={[styles.colValue, { width: '23.3%' }]}>
              <Text>{atividade.data ? format(new Date(atividade.data), 'dd/MM/yyyy') : ''}</Text>
            </View>
            <View style={[styles.colLabel, { width: '10%' }]}>
              <Text>Local:</Text>
            </View>
            <View style={[styles.colValue, { width: '23.3%' }]}>
              <Text>{atividade.local}</Text>
            </View>
            <View style={[styles.colLabel, { width: '15%' }]}>
              <Text>Duração da atividade:</Text>
            </View>
            <View style={[styles.colValueLast, { width: '18.4%' }]}>
              <Text>{atividade.duracao}</Text>
            </View>
          </View>

          {/* Row 2: Oficina, Atividade, Recursos */}
          <View style={styles.row}>
            <View style={[styles.colLabel, { width: '10%' }]}>
              <Text>Oficina:</Text>
            </View>
            <View style={[styles.colValue, { width: '23.3%' }]}>
              <Text>{atividade.oficina}</Text>
            </View>
            <View style={[styles.colLabel, { width: '10%' }]}>
              <Text>Atividade:</Text>
            </View>
            <View style={[styles.colValue, { width: '23.3%' }]}>
              <Text>{atividade.atividade_nome}</Text>
            </View>
            <View style={[styles.colLabel, { width: '15%' }]}>
              <Text>Recursos humanos:</Text>
            </View>
            <View style={[styles.colValueLast, { width: '18.4%' }]}>
              <Text>{atividade.recursos_humanos}</Text>
            </View>
          </View>

          {/* Row 3: Objetivos */}
          <View style={styles.row}>
            <View style={[styles.colLabel, { width: '10%' }]}>
              <Text>Objetivos:</Text>
            </View>
            <View style={[styles.colValueLast, { width: '90%' }]}>
              <Text>{atividade.objetivos}</Text>
            </View>
          </View>

          {/* Row 4: Utentes Headers */}
          <View style={styles.row}>
            <View style={[styles.utentesHeaderLabel, { width: '25%' }]}>
              <Text>Utentes:</Text>
            </View>
            <View style={[styles.utentesHeaderLabel, { width: '15%' }]}>
              <Text>Participantes:{'\n'}(Marcar com X)</Text>
            </View>
            <View style={[styles.utentesHeaderLabel, { width: '20%' }]}>
              <Text>Grau de participação{'\n'}(MB/B/S/PS/I)</Text>
            </View>
            <View style={[styles.utentesHeaderLabel, { width: '20%' }]}>
              <Text>Interesse demonstrado{'\n'}(MB/B/S/PS/I)</Text>
            </View>
            <View style={[styles.utentesHeaderLabelLast, { width: '20%' }]}>
              <Text>Alcance dos objetivos{'\n'}propostos* (MB/B/S/PS/I)</Text>
            </View>
          </View>

          {/* Utentes Data Rows */}
          {avaliacoes.map((av, index) => (
            <View style={styles.row} key={index}>
              <View style={[styles.utentesCellLeft, { width: '25%' }]}>
                <Text>{av.utentes?.alcunha}</Text>
              </View>
              <View style={[styles.utentesCell, { width: '15%' }]}>
                <Text>X</Text>
              </View>
              <View style={[styles.utentesCell, { width: '20%' }]}>
                <Text>{av.grau_participacao || ''}</Text>
              </View>
              <View style={[styles.utentesCell, { width: '20%' }]}>
                <Text>{av.interesse_demonstrado || ''}</Text>
              </View>
              <View style={[styles.utentesCellLast, { width: '20%' }]}>
                <Text>{av.alcance_objetivos || ''}</Text>
              </View>
            </View>
          ))}

          {/* Avaliação Global */}
          <View style={styles.row}>
            <View style={[styles.colLabel, { width: '25%' }]}>
              <Text>Avaliação Global{'\n'}da atividade</Text>
            </View>
            <View style={[styles.colValueLast, { width: '75%' }]}>
              <Text>{atividade.avaliacao_global || ''}</Text>
            </View>
          </View>

          {/* Dificuldades */}
          <View style={styles.row}>
            <View style={[styles.colLabel, { width: '25%' }]}>
              <Text>Dificuldades{'\n'}sentidas</Text>
            </View>
            <View style={[styles.colValueLast, { width: '75%' }]}>
              <Text>{atividade.dificuldades || ''}</Text>
            </View>
          </View>

          {/* Outras informações */}
          <View style={styles.lastRow}>
            <View style={[styles.colLabel, { width: '25%', borderBottomWidth: 0 }]}>
              <Text>Outras{'\n'}informações</Text>
            </View>
            <View style={[styles.colValueLast, { width: '75%' }]}>
              <Text>{atividade.outras_informacoes || ''}</Text>
            </View>
          </View>
        </View>

        {/* Legenda */}
        <View style={styles.legend}>
          <Text>Legenda: MB – Muito bom</Text>
          <Text>B – Bom</Text>
          <Text>S – Satisfatório</Text>
          <Text>PS – Pouco Satisfatório</Text>
          <Text>I – Insatisfatório</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          ASAD - Associação Social de Apoio à Deficiência{'\n'}
          Rua de São Jorge, nº881, 4880-281 Paradança, Mondim de Basto{'\n'}
          Telemóvel: 937 243 017 / Telefone: 255 382 271 / E-mail: geral@asad.pt{'\n'}
          NIPC: 513 745 327
        </Text>
      </Page>
    </Document>
  );
};
