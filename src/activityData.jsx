import React from 'react';
import {
    Car, Bus, TrainFront, Plane, Footprints,
    Lightbulb, Flame, Droplets,
    Utensils, Beef, Drumstick, Leaf,
    Trash2, Recycle, LeafyGreen, Warehouse,
    ShoppingBag, Smartphone, Shirt, Wind,
    Zap, Coffee, Package, Bike
} from 'lucide-react';

export const activityCategories = [
    {
        id: 'transportation',
        name: 'Transport',
        icon: '🚗',
        types: [
            { name: 'Car (Petrol)', factor: 0.18, unit: 'km', defaultAmount: 15 },
            { name: 'Car (Diesel)', factor: 0.17, unit: 'km', defaultAmount: 15 },
            { name: 'Electric Car', factor: 0.05, unit: 'km', defaultAmount: 20 },
            { name: 'Motorbike', factor: 0.1, unit: 'km', defaultAmount: 10 },
            { name: 'Bus Ride', factor: 0.06, unit: 'km', defaultAmount: 5 },
            { name: 'Train Ride', factor: 0.04, unit: 'km', defaultAmount: 30 },
            { name: 'Subway/Metro', factor: 0.03, unit: 'km', defaultAmount: 10 },
            { name: 'Electric Scooter', factor: 0.01, unit: 'km', defaultAmount: 3 },
            { name: 'Flight (Short)', factor: 150, unit: 'flight', defaultAmount: 1 },
            { name: 'Flight (Long)', factor: 800, unit: 'flight', defaultAmount: 1 },
            { name: 'Walk', factor: 0, unit: 'km', defaultAmount: 2 },
            { name: 'Cycle', factor: 0, unit: 'km', defaultAmount: 5 }
        ]
    },
    {
        id: 'energy',
        name: 'Home & Energy',
        icon: '💡',
        types: [
            { name: 'Electricity', factor: 0.4, unit: 'kWh', defaultAmount: 10 },
            { name: 'Natural Gas', factor: 0.2, unit: 'kWh', defaultAmount: 5 },
            { name: 'AC Usage (High)', factor: 1.5, unit: 'hours', defaultAmount: 4 },
            { name: 'Heating (Oil)', factor: 0.3, unit: 'kWh', defaultAmount: 10 },
            { name: 'Water Usage', factor: 0.1, unit: 'liters', defaultAmount: 150 },
            { name: 'Laundry (Hot)', factor: 0.9, unit: 'loads', defaultAmount: 1 },
            { name: 'Laundry (Cold)', factor: 0.1, unit: 'loads', defaultAmount: 1 },
            { name: 'Solar Energy', factor: -0.05, unit: 'kWh', defaultAmount: 5 }
        ]
    },
    {
        id: 'food',
        name: 'Food & Dining',
        icon: '🥗',
        types: [
            { name: 'Beef Meal', factor: 6.5, unit: 'serving', defaultAmount: 1 },
            { name: 'Pork/Lamb', factor: 3.5, unit: 'serving', defaultAmount: 1 },
            { name: 'Chicken Meal', factor: 1.5, unit: 'serving', defaultAmount: 1 },
            { name: 'Fish/Seafood', factor: 1.2, unit: 'serving', defaultAmount: 1 },
            { name: 'Vegetarian Meal', factor: 0.8, unit: 'serving', defaultAmount: 1 },
            { name: 'Vegan Meal', factor: 0.5, unit: 'serving', defaultAmount: 1 },
            { name: 'Takeout (Packaging)', factor: 0.4, unit: 'meals', defaultAmount: 1 },
            { name: 'Dairy Products', factor: 1.5, unit: 'units', defaultAmount: 1 },
            { name: 'Coffee/Tea', factor: 0.2, unit: 'cups', defaultAmount: 2 }
        ]
    },
    {
        id: 'shopping',
        name: 'Shopping & Goods',
        icon: '🛍️',
        types: [
            { name: 'New Clothes', factor: 15.0, unit: 'items', defaultAmount: 1 },
            { name: 'Second-hand/Thrift', factor: 0.5, unit: 'items', defaultAmount: 1 },
            { name: 'Smartphone', factor: 60.0, unit: 'devices', defaultAmount: 1 },
            { name: 'Laptop/PC', factor: 200.0, unit: 'devices', defaultAmount: 1 },
            { name: 'Plastic Bottle', factor: 0.1, unit: 'units', defaultAmount: 3 }
        ]
    },
    {
        id: 'waste',
        name: 'Waste & Recycling',
        icon: '🗑️',
        types: [
            { name: 'General Trash', factor: 0.5, unit: 'kg', defaultAmount: 2 },
            { name: 'Plastic Waste', factor: 0.7, unit: 'kg', defaultAmount: 0.5 },
            { name: 'Paper/Cardboard', factor: 0.2, unit: 'kg', defaultAmount: 1 },
            { name: 'Recycling', factor: -0.3, unit: 'kg', defaultAmount: 1 },
            { name: 'Composting', factor: -0.2, unit: 'kg', defaultAmount: 1 }
        ]
    }
];

export const ecoTips = [
    "Switching to LED bulbs saves about 5kg of CO2 per month.",
    "Reducing meat consumption once a week saves 15kg CO2.",
    "Unplugging electronics when not in use saves 2kg CO2/week.",
    "Walking instead of driving 5km saves ~1kg of CO2.",
    "Taking shorter showers can save up to 10kg of CO2 per month.",
    "Washing clothes in cold water saves up to 500 lbs of CO2 annually.",
    "Using a reusable water bottle prevents 5kg of plastic waste per year.",
    "Properly inflated tires improve gas mileage and reduce emissions.",
    "Planting a single tree can absorb 20kg of CO2 per year.",
    "Air-drying clothes instead of using a dryer saves significant energy.",
    "Using a programmable thermostat can reduce heating/cooling CO2 by 15%.",
    "Choosing public transport over a car ride reduces emissions by 70+%.",
    "Buying seasonal produce reduces carbon from long-distance transport.",
    "Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
    "Using a reusable bag for shopping saves 50 plastic bags a year.",
    "Reducing food waste helps reduce methane emissions from landfills."
];

export const formatAmount = (val, unit, prefs) => {
    if (!val && val !== 0) return '';
    
    // Convert distance
    if (unit === 'km' && prefs?.distanceUnit === 'miles') {
        return `${(val * 0.621371).toFixed(1)} miles`;
    }
    
    // Convert volume
    if (unit === 'liters' && prefs?.volumeUnit === 'gallons') {
        return `${(val * 0.264172).toFixed(1)} gal`;
    }
    
    // Default (no conversion needed or units match)
    return `${val} ${unit}`;
};

export const getIcon = (type) => {
    const t = type.toLowerCase();
    if (t.includes('car')) return <Car size={24} />;
    if (t.includes('bus')) return <Bus size={24} />;
    if (t.includes('subway') || t.includes('train')) return <TrainFront size={24} />;
    if (t.includes('flight')) return <Plane size={24} />;
    if (t.includes('walk')) return <Footprints size={24} />;
    if (t.includes('cycle') || t.includes('bike')) return <Bike size={24} />;
    if (t.includes('scooter')) return <Wind size={24} />;
    if (t.includes('elect') || t.includes('ac usage') || t.includes('solar')) return <Zap size={24} />;
    if (t.includes('gas') || t.includes('heat')) return <Flame size={24} />;
    if (t.includes('water') || t.includes('laundry')) return <Droplets size={24} />;
    if (t.includes('beef') || t.includes('meat') || t.includes('pork')) return <Beef size={24} />;
    if (t.includes('chicken') || t.includes('fish')) return <Drumstick size={24} />;
    if (t.includes('vegan') || t.includes('vege') || t.includes('produce')) return <Leaf size={24} />;
    if (t.includes('coffee') || t.includes('tea')) return <Coffee size={24} />;
    if (t.includes('takeout') || t.includes('bottle')) return <Package size={24} />;
    if (t.includes('clothes') || t.includes('thrift')) return <Shirt size={24} />;
    if (t.includes('phone') || t.includes('laptop')) return <Smartphone size={24} />;
    if (t.includes('shopping')) return <ShoppingBag size={24} />;
    if (t.includes('trash') || t.includes('general')) return <Trash2 size={24} />;
    if (t.includes('recycl')) return <Recycle size={24} />;
    if (t.includes('compost')) return <LeafyGreen size={24} />;
    return <Warehouse size={24} />;
};

export const getActivityUnit = (type) => {
    if (!type) return 'units';
    const t = type.toLowerCase().trim();
    
    // 1. Direct Search in Categories
    let unit = null;
    activityCategories.forEach(cat => {
        const found = cat.types.find(item => 
            item.name.toLowerCase().trim() === t || 
            t.includes(item.name.toLowerCase().trim())
        );
        if (found) unit = found.unit;
    });
    if (unit) return unit;

    // 2. Keyword Fallbacks
    if (t.includes('solar') || t.includes('elect') || t.includes('gas') || t.includes('energy')) return 'kWh';
    if (t.includes('car') || t.includes('ride') || t.includes('walk') || t.includes('cycle') || t.includes('km') || t.includes('miles')) return 'km';
    if (t.includes('water') || t.includes('liters')) return 'liters';
    if (t.includes('trash') || t.includes('waste') || t.includes('recycl') || t.includes('kg')) return 'kg';
    if (t.includes('meal') || t.includes('beef') || t.includes('food')) return 'serving';
    
    return 'units';
};

export const formatCO2 = (kg, unitPref) => {
    let value = kg;
    let unit = 'kg';
    
    if (unitPref === 'lb') {
        value = kg * 2.20462;
        unit = 'lb';
    } else if (unitPref === 'tonnes') {
        value = kg / 1000;
        unit = 't';
    }
    
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(Math.abs(value) < 0.1 ? 3 : 1)} ${unit}`;
};
