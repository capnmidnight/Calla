DIRECTORY=$(cd `dirname $0` && pwd)

if [[ $JITSI_HOST ]]; then
  JITSI_HOST="\"$JITSI_HOST\""
else
  JITSI_HOST='"jitsi" + window.location.hostname.substring(window.location.hostname.indexOf("."))'
fi
DEFAULT_JVB_HOST='meet.jitsi'
DEFAULT_JVB_MUC='muc.meet.jitsi'

cat > $DIRECTORY/constants.js <<- EOF
export const JITSI_HOST = $JITSI_HOST;
export const JVB_HOST = "${JVB_HOST:-$DEFAULT_JVB_HOST}";
export const JVB_MUC = "${JVB_MUC:-$DEFAULT_JVB_MUC}";
EOF

exec nginx -g "daemon off;"
