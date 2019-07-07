#pragma once
#include "widget.hpp"

class Editor;
class MapUtilWidget : public Widget {

public:
    MapUtilWidget(Editor * editor);
    virtual void define() override;
private:
    Editor * editorRef;
};