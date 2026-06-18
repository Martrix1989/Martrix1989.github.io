const THEME_STORAGE_KEY = 'mjfc-theme';

const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Some privacy modes can block localStorage; the active page still updates.
  }
};

const getSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

const setTheme = (theme, shouldSave = false) => {
  const nextTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = nextTheme;

  if (shouldSave) {
    saveTheme(nextTheme);
  }
};

setTheme(getStoredTheme() || getSystemTheme());

function contactar() {
  window.location.href = 'contacto.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleBtn');
  const logoIcon = document.getElementById('logoIcon');

  const syncThemeToggle = () => {
    if (!themeToggle) {
      return;
    }

    const isDark = document.documentElement.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
    themeToggle.setAttribute('aria-pressed', String(isDark));
  };

  if (themeToggle) {
    syncThemeToggle();
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.dataset.theme === 'dark';
      setTheme(isDark ? 'light' : 'dark', true);
      syncThemeToggle();
    });
  }

  if (window.matchMedia) {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (event) => {
      if (!getStoredTheme()) {
        setTheme(event.matches ? 'dark' : 'light');
        syncThemeToggle();
      }
    };

    if (colorSchemeQuery.addEventListener) {
      colorSchemeQuery.addEventListener('change', handleSystemThemeChange);
    } else if (colorSchemeQuery.addListener) {
      colorSchemeQuery.addListener(handleSystemThemeChange);
    }
  }

  if (sidebar && toggleBtn) {
    const toggleSidebar = (event) => {
      event.preventDefault();
      sidebar.classList.toggle('collapsed');
    };

    toggleBtn.addEventListener('click', toggleSidebar);

    if (logoIcon) {
      logoIcon.addEventListener('click', toggleSidebar);
    }
  }

  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');
  const chatOptions = document.getElementById('chatOptions');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  if (!chatbotToggle || !chatWindow || !chatClose || !chatBody || !chatOptions || !chatForm || !chatInput) {
    return;
  }

  const chatbotKnowledge = [
    {
      id: 'servicios',
      keywords: ['servicio', 'servicios', 'ofrecen', 'hacen', 'soluciones', 'web', 'pagina'],
      btnText: 'Servicios',
      reply: 'En Menarquita hacemos sublimado general, chapitas, tazas, cojines, poleras y regalos personalizados.',
    },
    {
      id: 'contacto',
      keywords: ['contacto', 'correo', 'email', 'telefono', 'llamar', 'escribir', 'whatsapp'],
      btnText: 'Contacto',
      reply: 'Puedes enviarnos una solicitud desde nuestro formulario de contacto.',
      link: 'contacto.html',
      linkText: 'Ir a contacto',
    },
    {
      id: 'mision',
      keywords: ['mision', 'quienes somos', 'empresa'],
      btnText: 'Misión',
      reply: 'Nuestra misión es personalizar con calidad y calidez, acompañando cada pedido desde el diseño hasta la entrega.',
      link: 'Mision.html',
      linkText: 'Ver misión',
    },
    {
      id: 'vision',
      keywords: ['vision', 'futuro', 'metas', 'crecimiento'],
      btnText: 'Visión',
      reply: 'Queremos ser el referente local en sublimado y personalización, accesible para cualquier persona o empresa.',
      link: 'Vision.html',
      linkText: 'Ver visión',
    },
    {
      id: 'horarios',
      keywords: ['horario', 'hora', 'abierto', 'cierran', 'dias'],
      btnText: 'Horarios',
      reply: 'Atendemos de lunes a viernes, desde las 09:00 hasta las 18:00 horas.',
    },
  ];

  const defaultReply = "No entendí bien tu consulta. Prueba preguntando por 'servicios', 'misión', 'visión', 'horarios' o 'contacto'.";

  const normalizeText = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const agregarMensaje = (texto, emisor, url = null, textoEnlace = 'Ver más') => {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.classList.add('chat-message', emisor);

    const parrafo = document.createElement('p');
    parrafo.innerText = texto;
    mensajeDiv.appendChild(parrafo);

    if (emisor === 'bot' && url) {
      const botonRedireccion = document.createElement('a');
      botonRedireccion.href = url;
      botonRedireccion.innerText = textoEnlace;
      botonRedireccion.classList.add('chat-redirect-btn');
      mensajeDiv.appendChild(botonRedireccion);
    }

    chatBody.appendChild(mensajeDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const renderizarSugerencias = () => {
    chatOptions.innerHTML = '';

    chatbotKnowledge.forEach((item) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.classList.add('chat-btn-option');
      boton.innerText = item.btnText;
      boton.addEventListener('click', () => ejecutarRespuesta(item.btnText, item));
      chatOptions.appendChild(boton);
    });
  };

  const ejecutarRespuesta = (textoUsuario, objetoRespuesta) => {
    chatInput.disabled = true;
    chatOptions.style.pointerEvents = 'none';
    agregarMensaje(textoUsuario, 'user');

    window.setTimeout(() => {
      agregarMensaje(objetoRespuesta.reply, 'bot', objetoRespuesta.link, objetoRespuesta.linkText);
      chatInput.disabled = false;
      chatOptions.style.pointerEvents = 'auto';
      chatInput.focus();
      renderizarSugerencias();
    }, 450);
  };

  chatbotToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      renderizarSugerencias();
    }
  });

  chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
  });

  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const textInput = chatInput.value.trim();

    if (!textInput) {
      return;
    }

    chatInput.value = '';
    const cleanInput = normalizeText(textInput);
    const coincidencia = chatbotKnowledge.find((item) => item.keywords.some((keyword) => cleanInput.includes(keyword)));
    ejecutarRespuesta(textInput, coincidencia || { reply: defaultReply });
  });
});
