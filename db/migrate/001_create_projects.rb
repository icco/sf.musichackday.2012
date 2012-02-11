Sequel.migration do
  change do
    create_table :projects do
      primary_key :id
      String :name
      Integer :user_id
      FalseClass :private, :default => false
      DateTime :created
      DateTime :modified
    end
  end
end
