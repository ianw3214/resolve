#pragma once
#include "widget.hpp"

class Editor;
class ArchetypeManager;
class NewEntityWidget : public Widget {
public:
    static const std::string widgetName;

    NewEntityWidget(Editor * editor);
    ~NewEntityWidget();

    void define() override;

private:
    Editor * editorRef;
    ArchetypeManager& archetypeManager;

    bool was_shown;
};