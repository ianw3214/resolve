#pragma once
#include "widget.hpp"

class Editor;
class Entity;
class EntityEditWidget : public Widget {
    
public:
    EntityEditWidget(Editor * editor);
    virtual void define() override;
private:
    Editor * editorRef;
};