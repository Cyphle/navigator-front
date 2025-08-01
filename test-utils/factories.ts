// export const anAsset = (
//   overrides: Partial<Asset> = {}
// ): Asset => ({
//   assetType: overrides.assetType ?? {
//     code: "code1",
//     names: [{ plural: "name", singular: "name", language: "en" }],
//     type: "type1",
//   },
//   code: overrides.code ?? "code1",
//   name: overrides.name ?? "name",
//   stonalIdentifier:overrides.stonalIdentifier ?? "stonalIdentifier",
//   effectiveDate: overrides.effectiveDate ?? "01-01-1000",
//   expirationDate: overrides.expirationDate ?? "01-01-3000",
//   externalIdentifiers: overrides.externalIdentifiers ?? [
//     {
//       identifier: "code1",
//       sourceName: "PRH",
//       sourceType: "ERP",
//     },
//     {
//       identifier: "code2",
//       sourceName: "DEFAULT_USER",
//       sourceType: "MANUAL",
//     }
//   ],
// });
//
// const propertiesMappingContent = [
//   'propertyCode,propertyName,abylaAttribute\n',
//   '"HOUSING_NB","Nombre de lots","A"\n',
//   '"LEASE_CODE","Identifiant du bail en cours","B"\n'
// ]
//
// export const aStartAbylaExporterValues = (
//   overrides: Partial<StartAbylaExporterValues> = {}
// ): StartAbylaExporterValues => {
//   const file = new File(propertiesMappingContent, "test.csv", {
//     type: "text/csv",
//   });
//   File.prototype.text = jest.fn(() => Promise.resolve("test"));
//
//   return {
//     allBuildingGroups: overrides.allBuildingGroups ?? true,
//     components: overrides.components ?? [],
//     mappingFile: overrides.mappingFile ?? file,
//     sourceName: overrides.sourceName,
//     sourceType: overrides.sourceType,
//     currentOrganization: overrides.currentOrganization ?? 'ORGA',
//   }
// };
