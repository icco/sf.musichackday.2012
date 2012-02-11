Sequel.migration do
  change do
    alter_table :entries do
      add_column :private, TrueClass, :default => true
    end
  end
end
