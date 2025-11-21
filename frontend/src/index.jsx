//index

import React from 'react';
import ReactDOM from 'react-dom/client';

import {
    createBrowserRouter,
    createRoutesFromElements, Navigate,
    Route,
    RouterProvider
} from "react-router-dom";



import Auth from "./pages/auth/Auth.jsx"
import LoginForm, {loader as loginLoader, action as loginAction} from "./pages/auth/LoginForm.jsx";
import RegisterForm, {action as registerAction} from "./pages/auth/RegisterForm.jsx";

import Layout, {loader as layoutLoader} from "./pages/App/Layout.jsx";
import Dashboard, {loader as dashboardLoader} from "./pages/App/dashboard/Dashboard.jsx";
import Patients, {loader as patientLoader} from "./pages/App/patients/Patients.jsx";
import PatientAdd, {loader as patientAddLoader, action as patientAddAction} from "./pages/App/patients/PatientAdd.jsx"
import PatientsInfo, {loader as patientsInfoLoader} from "./pages/App/patients/PatientsInfo.jsx";
import PatientsAnalysis, {loader as patientsAnalysisLoader} from "./pages/App/patients/PatientsAnalysis.jsx";
import PatientsHealthData, {loader as patientsHealthDataLoader, action as patientsHealthDataAction} from "./pages/App/patients/PatientsHealthData.jsx";
import PatientsPersonalData, {loader as patientsPersonalDataLoader, action as patientsPersonalDataAction} from "./pages/App/patients/PatientsPersonalData.jsx";
import Plans, {loader as plansLoader, action as plansAction} from "./pages/App/plans/Plans.jsx";
import PlanCreator, {loader as planCreatorLoader, action as planCreatorAction} from "./pages/App/plans/PlanCreator.jsx";
import Analysis, {loader as analysisLoader} from "./pages/App/analysis/Analysis.jsx";


const router = createBrowserRouter(createRoutesFromElements(
    <Route>
        <Route
            path="/"
            element={<Auth />}
        >
            <Route
                index
                element={<Navigate to="login" replace/>}
            />
            <Route
                path="login"
                element={<LoginForm />}
                loader={loginLoader}
                action={loginAction}
            />
            <Route
                path="register"
                element={<RegisterForm />}
                action={registerAction}
            />

        </Route>
        <Route
            element={<Layout />}
            loader={layoutLoader}
        >
            <Route
                path="dashboard"
                element={<Dashboard />}
                loader={dashboardLoader}
            />
            <Route
                path="patients"
                element={<Patients />}
                loader={patientLoader}
            />
            <Route
                path="patients/add"
                element={<PatientAdd />}
                loader={patientAddLoader}
                action={patientAddAction}
            />
            <Route
                path="patients/:id"
                element={<PatientsInfo />}
                loader={patientsInfoLoader}
            >
                <Route
                    index
                    element={<PatientsAnalysis/>}
                    loader={patientsAnalysisLoader}
                />
                <Route
                    path="health"
                    element={<PatientsHealthData />}
                    loader={patientsHealthDataLoader}
                    action={patientsHealthDataAction}
                />
                <Route
                    path="personal"
                    element={<PatientsPersonalData />}
                    loader={patientsPersonalDataLoader}
                    action={patientsPersonalDataAction}
                />
            </Route>
            <Route
                path="plans"
                element={<Plans />}
                loader={plansLoader}
                action={plansAction}
            />
            <Route
                path="plans/create"
                element={<PlanCreator />}
                loader={planCreatorLoader}
                action={planCreatorAction}
            />
            <Route
                path="calcs"
                element={<Analysis />}
                loader={analysisLoader}
            />

        </Route>
    </Route>
))

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
);