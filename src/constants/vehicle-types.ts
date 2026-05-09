export const TWO_WHEELER_TYPES = [
  { value: 'SCOOTY', label: 'Scooty' },
  { value: 'SCOOTER', label: 'Scooter' },
  { value: 'BIKE', label: 'Bike' },
  { value: 'SPORTS BIKE', label: 'Sports Bike' },
];

export const CAR_VEHICLE_TYPES = [
  { value: 'Hatchback', label: 'Hatchback' },
  { value: 'Sedan', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'MUV', label: 'MUV' },
  { value: 'Luxury', label: 'Luxury' },
  { value: 'Other', label: 'Other' },
];

export const ALL_VEHICLE_TYPES = [...TWO_WHEELER_TYPES, ...CAR_VEHICLE_TYPES];
