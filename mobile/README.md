



### Fontes

- expo install expo-font @expo-google-fonts/[nome da fonte]

#### Carregar as fontes (tudo em App.tsx)

- import { *AppLoading* } from 'expo';
Continua mostrando o splash screen do app até as fontes estarem carregadas, porque isso pode demorar um pouco...

- import { *Font_Weight* } from '@expo-google-fonts/fontName';
exeplo: ... { Archivo_400Regular } ...

+ useFonts em UMA das importações

- let [fonstLoades] = useFonts([
  - Font...
- ]);

##  Navegação no React Native

- biblioteca React Navigation

