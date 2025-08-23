import { useState, useEffect } from 'react';
import { graphqlClient } from '~/lib/graphql';
import { GET_EXAMPLES, CREATE_EXAMPLE } from '~/lib/queries';

interface Example {
  id: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export default function Examples() {
  const [examples, setExamples] = useState<Example[]>([]);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchExamples = async () => {
    try {
      console.log('Fetching examples...');
      const data = await graphqlClient.request<{ examples: Example[] }>(GET_EXAMPLES);
      setExamples(data.examples);
    } catch (error) {
      console.error('Error fetching examples:', error);
    }
  };

  const createExample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !value.trim()) return;
    
    setLoading(true);
    try {
      await graphqlClient.request(CREATE_EXAMPLE, { name, value });
      setName('');
      setValue('');
      await fetchExamples();
    } catch (error) {
      console.error('Error creating example:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamples();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Examples</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Example</h2>
        <form onSubmit={createExample} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Value:</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Example'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Examples List</h2>
        {examples.length === 0 ? (
          <p className="text-gray-500">No examples found.</p>
        ) : (
          <div className="grid gap-4">
            {examples.map((example) => (
              <div key={example.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold">{example.name}</h3>
                <p className="text-gray-600">{example.value}</p>
                <div className="text-sm text-gray-400 mt-2">
                  <p>Created: {new Date(example.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(example.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}