#!/usr/bin/env bash
# Genera il file htpasswd per il login di nginx leggendo username e password dal file .env.
# Da eseguire sul server, prima del deploy. Il file generato NON va nel repository né nell'immagine.
#
# Uso:
#   scripts/make-htpasswd.sh <file .env> <file htpasswd di output>
#   scripts/make-htpasswd.sh .env /etc/wiki/htpasswd
#
# Nel .env servono le righe:
#   WIKI_USER=nome-utente
#   WIKI_PASSWORD=la-password
# (valori senza virgolette, su una riga ciascuno)
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Uso: $0 <file .env> <file htpasswd di output>" >&2
  exit 2
fi

env_file="$1"
out_file="$2"

if [ ! -f "$env_file" ]; then
  echo "File .env non trovato: $env_file" >&2
  exit 1
fi

# Legge il valore di una chiave: prende la prima riga KEY=... e toglie il prefisso.
read_key() {
  local key="$1"
  grep -m1 "^${key}=" "$env_file" | cut -d= -f2- | tr -d '\r'
}

user="$(read_key WIKI_USER)"
password="$(read_key WIKI_PASSWORD)"

if [ -z "$user" ] || [ -z "$password" ]; then
  echo "WIKI_USER e WIKI_PASSWORD devono essere presenti e non vuoti nel .env" >&2
  exit 1
fi

# apr1 è il formato MD5 di Apache che nginx accetta; il sale è generato da openssl.
hash="$(openssl passwd -apr1 "$password")"

umask 077
printf '%s:%s\n' "$user" "$hash" > "$out_file"
chmod 600 "$out_file"

echo "htpasswd scritto in $out_file (utente: $user)"
