const menuItemUrl =
  "https://peopleconnectpictures.blob.core.windows.net/admin-home/menu-icon-admin.svg";

const config = {
  topImageUrl:
    "https://peopleconnectpictures.blob.core.windows.net/admin-home/admin-user-image.svg",
  topText: "Administrador",
  menuTitle: "Seleccione la página",
  items: [
    {
      id: 1,
      name: "Inicio",
      iconUrl: menuItemUrl,
      url: `${process.env.NEXT_PUBLIC_HOST}:3101/admin/admin-home`,
    },
    {
      id: 2,
      name: "Organigrama",
      iconUrl: menuItemUrl,
      url: `${process.env.NEXT_PUBLIC_HOST}:3102/admin/organigrama`,
    },
    {
      id: 3,
      name: "Atención al colaborador",
      iconUrl: menuItemUrl,
      url: `${process.env.NEXT_PUBLIC_HOST}:3103/admin/atencion-colaborador`,
    },
    {
      id: 4,
      name: "Permisos",
      iconUrl: menuItemUrl,
      url: `${process.env.NEXT_PUBLIC_HOST}:3104/admin/permisos`,
    },
    {
      id: 5,
      name: "Certificados laborales",
      iconUrl: menuItemUrl,
      url: `${process.env.NEXT_PUBLIC_HOST}:3105/admin/certificados-laborales`,
    },
    {
      id: 6,
      name: "Formularios",
      iconUrl: menuItemUrl,
      url: `${process.env.NEXT_PUBLIC_HOST}:3106/admin/formularios`,
    },
    {
      id: 7,
      name: "Sugerencias",
      iconUrl: menuItemUrl,
      url: `${process.env.NEXT_PUBLIC_HOST}:3107/admin/sugerencias`,
    },
    {
      id: 8,
      name: "Denuncias",
      iconUrl: menuItemUrl,
      url: `${process.env.NEXT_PUBLIC_HOST}:3109/admin/denuncias`,
    },
    {
      id: 9,
      name: "Feriados",
      iconUrl: menuItemUrl,
      url: `${process.env.NEXT_PUBLIC_HOST}:3108/admin/feriados`,
    },
    {
      id: 10,
      name: "Teletrabajo",
      iconUrl: menuItemUrl,
      url: `${process.env.NEXT_PUBLIC_HOST}:3110/admin/teletrabajo`,
    },
    {
      id: 11,
      name: "Análisis de puestos",
      iconUrl: menuItemUrl,
      url: `/admin/analisis-puestos`,
    },
    {
      id: 12,
      name: "Formación y Desarrollo",
      iconUrl: menuItemUrl,
      url: `${process.env.NEXT_PUBLIC_HOST}:3030/admin/certificaciones`,
    },
    {
      id: 13,
      name: "Onboarding",
      iconUrl: menuItemUrl,
      url: `/admin/onboarding`,
    },
    {
      id: 14,
      name: "Trabaja Con Nosotros",
      iconUrl: menuItemUrl,
      url: `/admin/trabaja-con-nosotros`,
    },
  ],
  logoutIconUrl:
    "https://peopleconnectpictures.blob.core.windows.net/admin-home/admin-user-image.svg",
};

export default config;