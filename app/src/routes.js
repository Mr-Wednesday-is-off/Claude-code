export const routes = [
  { path: '/vehicle', section: 'vehicle', step: 'initial', label: 'Vehicle Stop' },
  { path: '/vehicle/driver', section: 'vehicle', step: 'driver', label: 'Driver Rights' },
  { path: '/vehicle/passenger', section: 'vehicle', step: 'passenger', label: 'Passenger Rights' },
  { path: '/street', section: 'street', step: 'initial', label: 'Street Interaction' },
  { path: '/home', section: 'home', step: 'initial', label: 'Home Encounter' },
  { path: '/ice', section: 'ice', step: 'initial', label: 'ICE Encounter' },
  { path: '/rights', section: 'rights', step: 'initial', label: 'Rights Overview' },
];

export const sectionBasePaths = {
  vehicle: '/vehicle',
  street: '/street',
  home: '/home',
  ice: '/ice',
  rights: '/rights',
};

export const validSections = ['vehicle', 'street', 'home', 'ice', 'rights'];
