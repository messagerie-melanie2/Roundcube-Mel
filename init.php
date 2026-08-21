<?php

\Sentry\init([
  'dsn' => 'https://31155485b344467a831396001cd63108@analyse-mel-preprod.m2.e2.rie.gouv.fr/glitchtip/2',
  // Add request headers, cookies and IP address,
  // see https://docs.sentry.io/platforms/php/data-management/data-collected/ for more info
  'send_default_pii' => true,
]);