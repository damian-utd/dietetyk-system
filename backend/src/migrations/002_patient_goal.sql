BEGIN;

ALTER TABLE patients
    DROP CONSTRAINT IF EXISTS patients_goal_check;

ALTER TABLE patients
    ALTER COLUMN goal TYPE VARCHAR(50),
    ALTER COLUMN goal SET NOT NULL;

ALTER TABLE patients
    ADD CONSTRAINT patients_goal_check CHECK (goal IN (
        'Redukcja masy ciała',
        'Utrzymanie masy ciała',
        'Zwiększenie masy ciała',
        'Budowa masy mięśniowej',
        'Poprawa nawyków żywieniowych',
        'Poprawa wyników zdrowotnych'
    ));

COMMIT;
