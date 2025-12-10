import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Cotacao = {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
};

export default function App() {
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadCotacoes() {
    try {
      const response = await fetch(
        "https://economia.awesomeapi.com.br/json/all"
      );
      const json = await response.json();

      const arr = Object.values(json) as Cotacao[];

      setCotacoes(arr);
    } catch (error) {
      console.log("Erro ao carregar cotações:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCotacoes();
  }, []);

  const filtered = cotacoes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loading}>Carregando cotações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cotações de Moedas</Text>

      <TextInput
        placeholder="Pesquisar moeda..."
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => <CotacaoCard cotacao={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma moeda encontrada.</Text>
        }
      />
    </View>
  );
}

function CotacaoCard({ cotacao }: { cotacao: Cotacao }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{cotacao.name}</Text>

      <Text style={styles.value}>Valor atual: R$ {cotacao.bid}</Text>

      <Text style={styles.range}>
        Máximo: R$ {cotacao.high} | Mínimo: R$ {cotacao.low}
      </Text>

      <Text
        style={[
          styles.change,
          { color: Number(cotacao.pctChange) >= 0 ? "green" : "red" },
        ]}
      >
        Variação: {cotacao.pctChange}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    marginTop: 10,
    color: "#777",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 16,
  },
  input: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  range: {
    fontSize: 14,
    color: "#666",
  },
  change: {
    fontWeight: "700",
    marginTop: 6,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});
