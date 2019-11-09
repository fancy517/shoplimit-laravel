export const searchQueryParams = [
  'MLSNumber',
  'Status',
  'PropertyType',
  'Address',
  'City',
  'StateOrProvince',
  'BedsTotal',
  'BathsFull',
  'BathsHalf',
  'SqftTotal',
  'CurrentPrice',
  'PublicRemarks'
]

export const statusOptions = [
  // 'Status',
  'Active',
  'Sold'
]

export const propertyOptions = [
  // { text: 'Property Type', value: '' },
  // { text: 'Commercial', value: 'Commercial' },
  // { text: 'Farm/Ranch', value: 'Farm/Ranch' },
  // { text: 'Lot/Land', value: 'Lot/Land' },
  { text: 'Residential', value: 'Residential' }
  // { text: 'Single Family', value: 'Single Family' }
]

export const stateOptions = [
  { text: 'California', value: 'CA' },
  { text: 'New York', value: 'NY' },
  { text: 'Texas', value: 'TX' }
]

export const subPropertyOptions = [
  { text: 'Attached 1/2 Duplx', value: 'Duplx' },
  { text: 'Condo', value: 'Condo' },
  { text: 'House', value: 'House' },
  { text: 'Manufactured', value: 'Manufactured' },
  { text: 'Mobile Home', value: 'Mobile Home' },
  { text: 'TownHouse', value: 'TownHouse' }
]

export const dropdownNoOfBeds = [
  { text: '1+', value: '1' },
  { text: '2+', value: '2' },
  { text: '3+', value: '3' },
  { text: '4+', value: '4' },
  { text: '5+', value: '5' }
]

export const dropdownNoOfBaths = [
  // { text: 'Baths', value: '' },
  { text: '1+', value: '1' },
  { text: '2+', value: '2' },
  { text: '3+', value: '3' },
  { text: '4+', value: '4' },
  { text: '5+', value: '5' }
]

export const sortOptions = [
  { text: 'Price $-$$', value: 0 },
  { text: 'Price $$-$', value: 1 },
  { text: 'Beds', value: 2 },
  { text: 'Baths', value: 3 },
  { text: 'Footage', value: 4 },
  { text: 'Acreage', value: 5 },
  { text: 'Reducations', value: 6 },
  { text: 'Days on Website', value: 7 },
  { text: '# Pictures', value: 8 },
  { text: 'Walk Score', value: 9 },
  { text: 'Popularity', value: 10 }
]

export const layoutOptions = [
  { text: 'Grid', value: 0 },
  { text: 'List', value: 1 },
  { text: 'Map', value: 2 }
]

export const INITIAL_SEARCH_QUERY = {
  Status: 'Active',
  MLSNumber: '',
  Beds: '',
  Baths: '',
  PropertyType: '',
  PropertySubType: '',
  City: '',
  StateOrProvince: '',
  PostalCode: '',
  Price: '',
  SqFt: ''
}

export const SEARCH_LIMIT = 20
