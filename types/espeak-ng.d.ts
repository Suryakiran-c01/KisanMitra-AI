declare module "@echogarden/espeak-ng-emscripten" {
  const factory: (options?: {
    locateFile?: (file: string) => string;
    wasmBinary?: Uint8Array;
  }) => Promise<unknown>;
  export default factory;
}
