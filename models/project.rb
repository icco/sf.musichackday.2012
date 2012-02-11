class Project < Sequel::Model(:projects)
  def before_save
    self.created = Time.now if self.created.nil?
    self.updated = Time.now if self.modified?

    # If we return false, save will abort
    return true
  end

  def history
    return {}
  end

  def to_json
    return JSON.generate self
  end
end
