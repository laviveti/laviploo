// Declarações de tipos para arquivos CSS
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Declarações para imports de side-effect CSS específicos
declare module "./globals.css";
declare module "@/app/globals.css";
