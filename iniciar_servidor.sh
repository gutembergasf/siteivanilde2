#!/bin/bash
# Script para iniciar o servidor local do site da Dra. Ivanilde Vasconcelos

PORT=3000
DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🩺  Dra. Ivanilde Vasconcelos - Iniciando servidor..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅  Servidor em: http://localhost:$PORT"
echo "  📱  Abrindo no navegador..."
echo "  🔴  Para parar: pressione Ctrl+C"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Abrir navegador após 1 segundo
(sleep 1 && open "http://localhost:$PORT") &

# Iniciar servidor Python3
cd "$DIR"
python3 -m http.server $PORT
