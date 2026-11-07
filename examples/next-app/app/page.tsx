// Server component: the glass demo is client-only, but it must render on the server too.
import GlassDemo from './components/GlassDemo';

export default function Page() {
  return <GlassDemo />;
}
