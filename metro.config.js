const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// @supabase/supabase-js dynamically imports @opentelemetry/api at runtime
// in a try/catch for optional tracing. Metro analyses dynamic imports
// statically and fails because we don't have the package. Stub it out —
// we don't use OpenTelemetry tracing here.
const previousResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@opentelemetry/api') {
    return { type: 'empty' };
  }
  if (previousResolveRequest) {
    return previousResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
