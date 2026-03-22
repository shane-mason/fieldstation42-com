AUTHOR = 'Shane Mason'
SITENAME = 'FieldStation42'
SITEURL = 'https://fieldstation42.com'
SITESUBTITLE = 'Broadcast & Cable TV Simulator'

PATH = 'content'
TIMEZONE = 'America/Los_Angeles'
DEFAULT_LANG = 'en'

THEME = 'theme'

# Feed generation
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Static pages
PAGE_PATHS = ['docs']
ARTICLE_PATHS = ['news']

PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'

ARTICLE_URL = 'news/{slug}/'
ARTICLE_SAVE_AS = 'news/{slug}/index.html'

ARCHIVES_URL = 'news/'
ARCHIVES_SAVE_AS = 'news/index.html'

# Navigation
DISPLAY_PAGES_ON_MENU = False
DISPLAY_CATEGORIES_ON_MENU = False

MENUITEMS = [
    ('Docs', '/docs/'),
    ('Guides', '/docs/guides/'),
    ('Reference', '/docs/reference/'),
    ('News', '/news/'),
]

DEFAULT_PAGINATION = 10

STATIC_PATHS = ['images']

# Doc ordering
TEMPLATE_PAGES = {}
