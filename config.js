// config.js

const CONFIG = {
    PRODUCTOS: {
        POSPAGO: {
            nombre: "Pospago",
            valorPromedio: 15000,
            porcentajePago: 0.85, // 85%
            comisionNivel: 0.10   // 10% (Ejemplo base para M0)
        },
        B2B: {
            nombre: "B2B",
            valorPromedio: 50000,
            porcentajePago: 0.90, // 90%
            comisionNivel: 0.12   // 12%
        },
        HOGAR: {
            nombre: "Hogar",
            valorPromedio: 25000,
            porcentajePago: 0.80, // 80%
            comisionNivel: 0.15   // 15%
        },
        PREPAGO: {
            nombre: "Prepago",
            valorPromedio: 2000,
            porcentajePago: 1.00, // 100%
            comisionNivel: 0.05   // 5%
        }
    }
};
