try {
    const path = require.resolve('lucide-react');
    console.log('SUCCESS: lucide-react resolved to:', path);
    console.log('Package contents:', require('lucide-react'));
} catch (err) {
    console.error('FAILURE: Could not resolve lucide-react');
    console.error(err);
}
