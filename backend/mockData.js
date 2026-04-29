const mockActivities = [
    {
        _id: 'mock1',
        category: 'transportation',
        type: 'Car (Petrol)',
        amount: 25,
        co2ImpactKg: 4.5,
        date: new Date().toISOString()
    },
    {
        _id: 'mock2',
        category: 'energy',
        type: 'Electricity',
        amount: 10,
        co2ImpactKg: 4.0,
        date: new Date(Date.now() - 86400000).toISOString()
    },
    {
        _id: 'mock4',
        category: 'waste',
        type: 'General Trash',
        amount: 5,
        co2ImpactKg: 2.5,
        date: new Date(Date.now() - 259200000).toISOString()
    },
    {
        _id: 'mock5',
        category: 'transportation',
        type: 'Bus Ride',
        amount: 12,
        co2ImpactKg: 0.7,
        date: new Date(Date.now() - 345600000).toISOString()
    }
];

module.exports = mockActivities;
