export const getServiceCreator =
  <TService, TDependencies extends object>(implementation: (dependencies: TDependencies) => TService) =>
  (dependencies: TDependencies) =>
    implementation(dependencies);
