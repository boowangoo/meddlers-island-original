declare type ID = string;
declare type Html = string;
declare type Css = string;

declare module '*html' {
    const content: Html;
    export default content;
}

declare module '*css' {
    const content: Css;
    export default content;
}

declare module '*.json' {
    const content: any;
    export default content;
}

declare module "*.svg" {
    const content: any;
    export default content;
}