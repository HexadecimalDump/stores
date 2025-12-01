// Helper function to map lowercase field keys to Swagger-defined keys
export const mapSortKeyToApi = (key: string): string => {
  switch (key) {
    case 'id':
      return 'ID';
    case 'name':
      return 'Name';
    case 'category':
      return 'Category';
    default:
      return key;
  }
};
