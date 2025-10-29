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

import Layout from "./pages/App/Layout.jsx";
import Dashboard, {loader as dashboardLoader} from "./pages/App/dashboard/Dashboard.jsx";
import Patients, {loader as patientLoader} from "./pages/App/patients/Patients.jsx";
import PatientAdd, {loader as PatientAddLoader, action as PatientAddAction} from "./pages/App/patients/PatientAdd.jsx"
import Plans, {loader as plansLoader} from "./pages/App/plans/Plans.jsx";
import PlanCreator, {loader as planCreatorLoader} from "./pages/App/plancreator/PlanCreator.jsx";
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
                loader={PatientAddLoader}
                action={PatientAddAction}
            />
            <Route
                path="plans"
                element={<Plans />}
                loader={plansLoader}
            />
            <Route
                path="plancreator"
                element={<PlanCreator />}
                loader={planCreatorLoader}
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