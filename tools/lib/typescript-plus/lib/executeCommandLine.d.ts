declare namespace ts {
    function isBuild(commandLineArgs: readonly string[]): boolean;
    type ExecuteCommandLineCallbacks = (program: Program | EmitAndSemanticDiagnosticsBuilderProgram | ParsedCommandLine) => void;
    function executeCommandLine(system: System, cb: ExecuteCommandLineCallbacks, commandLineArgs: readonly string[]): void | WatchOfConfigFile<EmitAndSemanticDiagnosticsBuilderProgram> | SolutionBuilder<EmitAndSemanticDiagnosticsBuilderProgram>;
}
//# sourceMappingURL=executeCommandLine.d.ts.map