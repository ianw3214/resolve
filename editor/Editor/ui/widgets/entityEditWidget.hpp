#pragma once
#include "widget.hpp"

#include "nlohmann/json.hpp"

class Editor;
class Entity;
class ArchetypeManager;
class EntityEditWidget : public Widget {
    
public:
    EntityEditWidget(Editor * editor);
    virtual void define() override;
private:
    Editor * editorRef;
    ArchetypeManager & archetypeManager;

    void print_json_object(const nlohmann::json& data, int level = 0);
};