import React, { useState } from 'react';

interface TeamFormValues {
  name: string;
  slug: string;
  description?: string;
}

interface TeamFormProps {
  initialValues?: Partial<TeamFormValues>;
  loading?: boolean;
  onSubmit: (values: TeamFormValues) => Promise<void> | void;
  onCancel: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({
  initialValues,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState<TeamFormValues>({
    name: initialValues?.name || '',
    slug: initialValues?.slug || '',
    description: initialValues?.description || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name.trim()) return;

    const slug =
      values.slug.trim() ||
      values.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    await onSubmit({
      ...values,
      name: values.name.trim(),
      slug,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Team Name *
        </label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          disabled={loading}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g. Complaints Team"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL Slug
        </label>
        <input
          type="text"
          name="slug"
          value={values.slug}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g. complaints-team"
        />
        <p className="mt-1 text-xs text-gray-500">
          Used for URLs and routing. Leave blank to auto-generate.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          placeholder="Optional description of this team"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !values.name.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Team'}
        </button>
      </div>
    </form>
  );
};

export default TeamForm;

