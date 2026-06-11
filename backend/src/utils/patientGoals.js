export const PATIENT_GOALS = [
    "Redukcja masy ciała",
    "Utrzymanie masy ciała",
    "Zwiększenie masy ciała",
    "Budowa masy mięśniowej",
    "Poprawa nawyków żywieniowych",
    "Poprawa wyników zdrowotnych"
];

export function isValidPatientGoal(goal) {
    return PATIENT_GOALS.includes(goal);
}
